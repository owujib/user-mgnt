import Kernel from './kernel'

const PORT = Kernel.get('PORT')

Kernel.listen(Kernel.get('PORT'), ()=>{
    console.log('server is runing')
})