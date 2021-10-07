import { SetMetadata } from "@nestjs/common";

export const IsStrict = () => SetMetadata('strict-login', true)