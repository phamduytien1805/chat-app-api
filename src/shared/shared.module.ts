import { Global, Module, Provider } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';

const providers: Provider[] = [ApiConfigService];

@Global()
@Module({
  providers: providers,
  exports: [...providers],
})
export class SharedModule {}
