import Kernel from './kernel';

const PORT = Kernel.get('PORT');

console.log(Kernel.app('NODE_ENV'));

Kernel.listen(Kernel.get('PORT'), () => {
  console.log('server is runing');
});
