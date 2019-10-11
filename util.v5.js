function checkWinner(elements){
    var haveWinner = false;
    //Vertikalno
    for(var i =0;i<6;i++){
        var owner=null
        var count = 0
        var winArr = []
        for(var j = 0;j<6;j++){
            const figura = elements[i][j]
            if(owner == figura.owner){
                winArr.push(''+j+i)
                ++count
            }else if(figura.owner !='free'){
                count = 1
                winArr=[''+j+i]
                owner = figura.owner
            }else{
                winArr=[]
                count = 0
                owner = -1
            }
            if(count ==4){
                return {'owner':owner,'winArr':winArr};
            }
        }
    }
    
    //Horizontalno
    for(var i =0;i<6;i++){
        var owner=null
        var count = 0
        var winArr = []
        for(var j = 0;j<6;j++){
            const figura = elements[j][i]
            if(owner == figura.owner){
                winArr.push(''+i+j)
                ++count
            }else if(figura.owner !='free'){
                count = 1
                winArr=[''+i+j]
                owner = figura.owner
            }else{
                winArr=[]
                count = 0
                owner = -1
            }
            if(count ==4){
                return {'owner':owner,'winArr':winArr};
                
            }
        }
        
    }
    //Dijagonala glavna
    for(var j =0;j<6;j++){
        var owner=null
        var count = 0
        var dj=j
        var winArr = []
        for(var i = 0;i<=j;i++){
            const figura = elements[i][dj]
            if(owner == figura.owner){
                ++count
                winArr.push(''+dj+i)
            }else if(figura.owner !='free'){
                count = 1
                winArr=[''+dj+i]
                owner = figura.owner
            }else{
                winArr=[]
                count = 0
                owner = -1
            }
            if(count ==4){
                return {'owner':owner,'winArr':winArr};
                
            }
            --dj;
        }
        
    }
    for(var i =1;i<6;i++){
        var owner=null
        var count = 0
        var di=i
        var winArr=[]
        for(var j = 5;j>=i;j--){
            const figura = elements[di][j]
            if(owner == figura.owner){
                winArr.push(''+j+di)
                ++count
            }else if(figura.owner !='free'){
                count = 1
                winArr=[''+j+di]
                owner = figura.owner
            }else{
                count = 0
                winArr=[]
                owner = -1
            }
            if(count ==4){
                return {'owner':owner,'winArr':winArr};
                
            }
            ++di;
        }
        
    }
    //Dijagonala sporedna
    for(var j =0;j<6;j++){
        var owner=null
        var count = 0
        var dj=j
        var winArr=[]
        for(var i = 0;i<6-j;i++){            
            const figura = elements[i][dj]
            if(owner == figura.owner){
                ++count
                winArr.push(''+dj+i)
            }else if(figura.owner !='free'){
                count = 1
                winArr=[''+dj+i]
                owner = figura.owner
            }else{
                winArr=[]
                count = 0
                owner = -1
            }
            if(count ==4){
                return {'owner':owner,'winArr':winArr};
                
            }
            ++dj;
        }
        
    }
    //Dijagonala sporedna
    for(var i =1;i<6;i++){
        var owner=null
        var count = 0
        var di=i
        var winArr=[]
        for(var j = 0;j<6-i;j++){
            
            const figura = elements[di][j]
            if(owner == figura.owner){
                winArr.push(''+j+di)
                ++count
            }else if(figura.owner !='free'){
                count = 1
                owner = figura.owner
                winArr=[''+j+di]
            }else{
                count = 0
                owner = -1
                winArr=[]
            }
            if(count ==4){
                return {'owner':owner,'winArr':winArr};
                
            }
            ++di;
        }
    }
    return {'owner':false,'winArr':[]}
}
