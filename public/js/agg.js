function Iniciar(nombre_dataBase, version){
    this.inicia = (objetoCollections)=>{
        return new Promise((resolve, reject)=>{
            let uno = indexedDB.open(nombre_dataBase, version)
            uno.onsuccess = (e)=>{
                db = e.target.result
                resolve('bien')
            }
            uno.onupgradeneeded = (e)=>{
                db = e.target.result
                for(var a = 0; a<objetoCollections.length; a++){
                    var objetoStore = db.createObjectStore(objetoCollections[a].nombre,
                                         objetoCollections[a].keyPath ? 
                                                           {keyPath:objetoCollections[a].keyPath} : 
                                                           {autoIncrement: true}
                                        )
                    objetoCollections[a].Index.forEach(function(item){
                        objetoStore.createIndex(item.nombre, item.nombre, {unique: item.estado})
                    })
                }
            }
        })
    }
    this.getOne = (nombreCollections, datoBusq)=>{
       return new Promise(function(resolve, reject){
            let transaccion = db.transaction(nombreCollections, 'readwrite'),
                almacen = transaccion.objectStore(nombreCollections),
                traer = almacen.get(datoBusq)
            traer.onsuccess = (event)=>{
                resolve(event.target.result)
            }
        })
    }
    this.getAll = (nombreCollections)=>{
       return new Promise(function(resolve,reject){
            var coleccion =[]
            let transaccion = db.transaction(nombreCollections),
                almacen = transaccion.objectStore(nombreCollections);
            almacen.openCursor().onsuccess =(e)=>{
                let cursor = e.target.result
                if(cursor){
                    coleccion.push(cursor.value)
                    cursor.continue()
                }else{
                    resolve(coleccion)
                }
            }
        })
    }
    this.agregar = (nombreCollections, objetoAgregar)=>{
       return new Promise(function(resolve, reject){
            let transaccion = db.transaction(nombreCollections, 'readwrite'),
                almacen = transaccion.objectStore(nombreCollections),
                guardar = almacen.add(objetoAgregar)
            guardar.onsuccess = (e)=>{
                resolve(e.target.result)
            }
            guardar.onerror = (Error)=>{
                reject(Error)
            }
        })
    }
    this.delete = (nombreCollections, keyDelete)=>{
       return new Promise((resolve, reject)=>{
            let transaccion = db.transaction(nombreCollections, 'readwrite'),
                almacen = transaccion.objectStore(nombreCollections),
                borrar = almacen.delete(keyDelete);
            borrar.onsuccess = (e)=>{
                resolve(e.target.result)
            }
        })
    }
    this.guardarEdit = (nombreCollection, objetoEditado)=>{
       return new Promise((resolve,reject)=>{
            let transaccion = db.transaction([nombreCollection], 'readwrite'),
                almacen = transaccion.objectStore(nombreCollection),
                guardEdit = almacen.put(objetoEditado);
            guardEdit.onsuccess = (e)=>{
                resolve(e.target.result)
            }  
        })
    }
    this.getAllSimple = (nombreCollections)=>{
        //puede haber un alto costo de rendimiento
        return new Promise((resolve,reject)=>{
            let transaccion = db.transaction(nombreCollections),
                almacen = transaccion.objectStore(nombreCollections),
                traerAll = almacen.getAll()
            traerAll.onsuccess = (e)=>{
                resolve(e.target.result)
            }
        })
    }
    this.getIndex = (nombreCollections,nameIndex, indexValue)=>{
        return new Promise((resolve,reject)=>{
            let transaccion = db.transaction(nombreCollections),
                almacen = transaccion.objectStore(nombreCollections),
                index = almacen.index(nameIndex),
                traer = index.get(indexValue);
            traer.onsuccess = (e)=>{
                resolve(e)
            }
        })
    }
    this.getAllIndex = (nombreCollections,nameIndex, indexValue)=>{
            return new Promise((resolve,reject)=>{
                let transaccion = db.transaction(nombreCollections),
                    almacen = transaccion.objectStore(nombreCollections),
                    index = almacen.index(nameIndex),
                    objeto = []
                index.openCursor().onsuccess = (e)=>{
                    let cursor = e.target.result;
                    if(cursor){
                        if(cursor.key == indexValue)
                            objeto.push(cursor.primaryKey)
                        cursor.continue()
                    }else{
                        resolve(objeto)
                    }
                }
            })
    }
    this.eliminarContent = (nombreCollections)=>{
        return new Promise((resolve,reject)=>{
            let transaction = db.transaction([nombreCollections], 'readwrite'),
                almacen = transaction.objectStore(nombreCollections),
                resultado = almacen.clear()
            resultado.onsuccess = (e)=>{
                resolve('Eliminado')
            }
        })
    }
}