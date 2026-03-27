import { SetMetadata } from '@nestjs/common';

export const SKIP_ACCESS_GUARD = 'skipUserAccessGuard';
export const SkipAccessGuard = () => SetMetadata(SKIP_ACCESS_GUARD, true);