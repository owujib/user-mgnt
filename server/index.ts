import Kernel from './kernel';

const PORT = Kernel.get('PORT');

console.log(Kernel.get('NODE_ENV'));

Kernel.listen(Kernel.get('PORT'), () => {
  console.log('server is runing');
});
