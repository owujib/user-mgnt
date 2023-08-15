import { Logger } from './config/logger';
import Kernel from './kernel';

const PORT = Kernel.get('PORT');

console.log(Kernel.get('NODE_ENV'));

Kernel.listen(Kernel.get('PORT'), () => {
  Logger.info(`server is runing on PORT:${PORT}`);
});
