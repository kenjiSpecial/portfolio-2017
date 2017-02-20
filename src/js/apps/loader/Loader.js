let instance = null;
const THREE = require('three');

export default class Loader extends THREE.EventDispatcher {
    constructor() {
        super();
        if(!instance){
            instance = this;
            this.initialize();
        }

        return instance;
    }

    initialize(){
        this.geometries = {};
        this.textures = {};
        this.jsonLoader = new THREE.JSONLoader();
        this.textureLoader = new THREE.TextureLoader();

    }

    addAssets(assets){
        this.cnt = 0;
        this.totalLength = 0;

        assets.json.forEach((name)=>{
            let fileName = `${assets.base}/${name}.json`

            this.jsonLoader.load(fileName, (geo)=>{
                this.geometries[name] = geo;

                this.cnt++;
                this.updateRate();
                if(this.cnt == this.totalLength) this._loaded();
            })
        })

        this.totalLength += assets.json.length;

        if(assets.images && assets.images.length){
            assets.images.forEach((image)=>{
                let imageSrc = image.src;
                let imageName = image.name;
                this.textureLoader.load(imageSrc, (texture)=>{
                    texture.minFilter = THREE.LinearFilter
                    this.textures[imageName] = texture;

                    this.cnt++;
                    this.updateRate();
                    if(this.cnt == this.totalLength) this._loaded();
                } );
            });

            this.totalLength += assets.images.length;
        }

        this.updateRate();
    }



    _loaded(){
        this.dispatchEvent ( {type: 'loaded'} );
    }

    updateRate(){
        this.rate = parseInt(this.cnt/this.totalLength * 100);
    }


}