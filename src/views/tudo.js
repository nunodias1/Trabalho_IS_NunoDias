"use strict"
class inicial {

    

    constructor (){

    }
    
    async findLivros1(){

        return (await fetch("http:localhost:3000/livros"))
            
    }

}