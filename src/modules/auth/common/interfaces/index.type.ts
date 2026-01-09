// i recommend to use `interface` for defining types
// but if you need to use `type` then use `type` instead of `class`
// internal utility for user module

import { AuthorizeDto } from '../dtos/authorize.dto';

// use static methods to avoid creating instances of this class
export interface AuthQueueTrackSessionData {
  dto: AuthorizeDto;
  authData: Record<string, any>;
}
