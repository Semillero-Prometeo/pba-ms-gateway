import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { firstValueFrom, timeout } from 'rxjs';
import { MAI_CORE_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { Server, WebSocket } from 'ws';
import { VisionWsAuthService } from './vision-ws-auth.service';

const VISION_WS_PATH = '/vision/ws';
const SNAPSHOT_INTERVAL_MS = 500;
const NATS_TIMEOUT_MS = 20_000;

interface ClientVisionState {
  selectedCameraId: string | null;
  thumbMaxWidth: number;
  previewMaxWidth: number;
}

type ClientInboundMessage =
  | { type: 'setSelection'; selectedCameraId: string | null }
  | { type: 'setQuality'; thumbMaxWidth: number; previewMaxWidth: number };

@WebSocketGateway({ path: VISION_WS_PATH, transports: ['websocket'] })
export class VisionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(VisionGateway.name);

  @WebSocketServer()
  server!: Server;

  private readonly intervals = new WeakMap<WebSocket, ReturnType<typeof setInterval>>();
  private readonly states = new WeakMap<WebSocket, ClientVisionState>();

  constructor(
    @Inject(NATS_SERVICE) private readonly nats: ClientProxy,
    private readonly visionWsAuth: VisionWsAuthService,
  ) {}

  async handleConnection(client: WebSocket, req?: IncomingMessage): Promise<void> {
    const upgradeReq =
      req ?? (client as unknown as { upgradeReq?: IncomingMessage }).upgradeReq;
    try {
      await this.visionWsAuth.verifyUpgradeRequest(upgradeReq);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unauthorized';
      this.safeSend(client, { type: 'error', message: msg });
      client.close(4001, msg);
      return;
    }

    const state: ClientVisionState = {
      selectedCameraId: null,
      thumbMaxWidth: 160,
      previewMaxWidth: 640,
    };
    this.states.set(client, state);

    client.on('message', (raw: Buffer) => {
      this.onClientMessage(client, raw);
    });

    const tick = async () => {
      await this.pushSnapshot(client);
    };
    void tick();
    const id = setInterval(() => void tick(), SNAPSHOT_INTERVAL_MS);
    this.intervals.set(client, id);
  }

  handleDisconnect(client: WebSocket): void {
    const id = this.intervals.get(client);
    if (id) {
      clearInterval(id);
      this.intervals.delete(client);
    }
    this.states.delete(client);
  }

  private onClientMessage(client: WebSocket, raw: Buffer): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.toString()) as unknown;
    } catch {
      this.safeSend(client, { type: 'error', message: 'Invalid JSON' });
      return;
    }
    if (!parsed || typeof parsed !== 'object' || !('type' in parsed)) {
      this.safeSend(client, { type: 'error', message: 'Invalid message shape' });
      return;
    }
    const msg = parsed as ClientInboundMessage;
    const state = this.states.get(client);
    if (!state) return;

    if (msg.type === 'setSelection') {
      state.selectedCameraId = msg.selectedCameraId ?? null;
      return;
    }
    if (msg.type === 'setQuality') {
      state.thumbMaxWidth = Math.min(640, Math.max(32, Math.floor(msg.thumbMaxWidth)));
      state.previewMaxWidth = Math.min(1920, Math.max(160, Math.floor(msg.previewMaxWidth)));
    }
  }

  private async pushSnapshot(client: WebSocket): Promise<void> {
    const state = this.states.get(client);
    if (!state || client.readyState !== WebSocket.OPEN) return;

    const payload = {
      selectedCameraId: state.selectedCameraId,
      thumbMaxWidth: state.thumbMaxWidth,
      previewMaxWidth: state.previewMaxWidth,
    };

    try {
      const data = await firstValueFrom(
        this.nats.send(`${MAI_CORE_MS}.visionService.getSnapshot`, payload).pipe(timeout(NATS_TIMEOUT_MS)),
      );
      this.safeSend(client, { type: 'snapshot', data });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      this.logger.warn(`Vision snapshot failed: ${message}`);
      this.safeSend(client, { type: 'error', message });
    }
  }

  private safeSend(client: WebSocket, obj: unknown): void {
    if (client.readyState !== WebSocket.OPEN) return;
    try {
      client.send(JSON.stringify(obj));
    } catch (err) {
      this.logger.warn(`WS send failed: ${err}`);
    }
  }
}
