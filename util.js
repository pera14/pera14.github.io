function checkWinner(elements){
    var haveWinner = false;
    //Vertikalno
    for(var i =0;i<6;i++){
        var owner=null
        var count = 0
        for(var j = 0;j<6;j++){
            const figura = elements[i][j]
            if(owner == figura.owner){
                ++count
            }else if(figura.owner !='free'){
                count = 1
                owner = figura.owner
            }else{
                count = 0
                owner = -1
            }
            if(count ==4){
                //console.log('Pobednik je '+owner+" Vertikalno!!!",elements);
                return owner;
                break;
            }
        }
        if(haveWinner)
            break
    }
    //Horizontalno
    for(var i =0;i<6;i++){
        var owner=null
        var count = 0
        for(var j = 0;j<6;j++){
            const figura = elements[j][i]
            if(owner == figura.owner){
                ++count
            }else if(figura.owner !='free'){
                count = 1
                owner = figura.owner
            }else{
                count = 0
                owner = -1
            }
            if(count ==4){
                //console.log('Pobednik je '+owner+" horizontalno!!!");
                return owner;
                break;
            }
        }
        if(haveWinner)
            break
    }
    //Dijagonala glavna
    for(var j =0;j<6;j++){
        var owner=null
        var count = 0
        var dj=j
        for(var i = 0;i<=j;i++){
            // //console.log('Dijagonala:',i,dj);
            
            const figura = elements[i][dj]
            if(owner == figura.owner){
                ++count
            }else if(figura.owner !='free'){
                count = 1
                owner = figura.owner
            }else{
                count = 0
                owner = -1
            }
            if(count ==4){
                //console.log('Pobednik je '+owner+" glavna!!!");
                return owner;
                break;
            }
            --dj;
        }
        if(haveWinner)
            break
    }
    for(var i =1;i<6;i++){
        var owner=null
        var count = 0
        var di=i
        for(var j = 5;j>=i;j--){
            // //console.log('DijagonalaSpecijal:',di,j);
            
            const figura = elements[di][j]
            if(owner == figura.owner){
                ++count
            }else if(figura.owner !='free'){
                count = 1
                owner = figura.owner
            }else{
                count = 0
                owner = -1
            }
            if(count ==4){
                //console.log('Pobednik je '+owner+" glavna spec!!!");
                return owner;
                break;
            }
            ++di;
        }
        if(haveWinner)
            break
    }
    //Dijagonala sporedna
    for(var j =0;j<6;j++){
        var owner=null
        var count = 0
        var dj=j
        for(var i = 0;i<6-j;i++){            
            const figura = elements[i][dj]
            if(owner == figura.owner){
                ++count
            }else if(figura.owner !='free'){
                count = 1
                owner = figura.owner
            }else{
                count = 0
                owner = -1
            }
            if(count ==4){
                //console.log('Pobednik je '+owner+" sporedna!!!");
                return owner;
                break;
            }
            ++dj;
        }
        if(haveWinner)
            break
    }
    //Dijagonala sporedna
    for(var i =1;i<6;i++){
        var owner=null
        var count = 0
        var di=i
        for(var j = 0;j<6-i;j++){
            
            const figura = elements[di][j]
            if(owner == figura.owner){
                ++count
            }else if(figura.owner !='free'){
                count = 1
                owner = figura.owner
            }else{
                count = 0
                owner = -1
            }
            if(count ==4){
                //console.log('Pobednik je '+owner+" sporedna spec!!!");
                return owner;
                break;
            }
            ++di;
        }
        if(haveWinner)
            break
    }
    return haveWinner
}

function findDangerousFields(){
    var haveWinner = false;
    var dangerousFields = []
    //Vertikalno
    for(var i =0;i<6;i++){
        var owner=null
        var count = 0
        for(var j = 0;j<6;j++){
            const figura = elements[i][j]
            if('user' == figura.owner){
                ++count
            }else{
                count = 0
                owner = -1
            }
            if(count ==3){
                //console.log(i,j);
                if(j-3>0 && elements[i][j-3].owner=='free'){
                    dangerousFields.push({'x':i,'y':j-3})
                    elements[i][j-3].color = 'green'
                    // haveWinner=ownertrue;
                    break;
                }
                
            }
        }
        if(haveWinner)
            break
    }
    //Horizontalno
    for(var i =0;i<6;i++){
        var owner=null
        var count = 0
        for(var j = 0;j<6;j++){
            const figura = elements[j][i]
            if('user' == figura.owner){
                ++count
            }else{
                count = 0
                owner = -1
            }
            if(count ==3){
                if(j<5 && elements[j+1][i].owner=='free'&& (i+1<6 && elements[j+1][i+1].owner !='free' || i+1==6)){
                    dangerousFields.push({'x':j+1,'y':i})
                    elements[j+1][i].color = 'green'
                    // haveWinner=owner;
                }
                if(j-3>=0 && elements[j-3][i].owner=='free'&& (i+1<6 && elements[j-3][i+1].owner !='free' || i+1==6)){
                    dangerousFields.push({'x':j-3,'y':i})
                    elements[j-3][i].color = 'green'
                    // haveWinner=owner;
                }
                
            }
        }
        if(haveWinner)
            break
    }
    //Dijagonala glavna
    for(var j =0;j<6;j++){
        var owner=null
        var count = 0
        var dj=j
        for(var i = 0;i<=j;i++){
            // //console.log('Dijagonala:',i,dj);
            
            const figura = elements[i][dj]
            if('user' == figura.owner){
                ++count
            }else{
                count = 0
                owner = -1
            }
            if(count ==3){
                if(i<j && dj>1 && elements[i+1][dj-1].owner=='free'&& (i+1<6 && elements[i+1][dj].owner !='free')){
                    dangerousFields.push({'x':i+1,'y':dj-1})
                    elements[i+1][dj-1].color = 'green'
                    // haveWinner=owner;
                }
                if(i-3>=0 && dj+3<6 && elements[i-3][dj+3].owner=='free'&& (dj+4<6 && elements[i-3][dj+4].owner !='free')){
                    dangerousFields.push({'x':i-3,'y':dj+3})
                    elements[i-3][dj+3].color = 'green'
                    // haveWinner=owner;
                }
            }
            --dj;
        }
        if(haveWinner)
            break
    }
    for(var i =1;i<6;i++){
        var owner=null
        var count = 0
        var di=i
        for(var j = 5;j>=i;j--){
            // //console.log('DijagonalaSpecijal:',di,j);
            
            const figura = elements[di][j]
            // figura.color = 'purple'
            if('user' == figura.owner){
                ++count
            }else{
                count = 0
                owner = -1
            }
            if(count ==3){
                //console.log(di,j,i);
                
                if(di+1<=5 && j-1>=i && elements[di+1][j-1].owner=='free'&& (elements[di+1][j].owner !='free')){
                    dangerousFields.push({'x':di+1,'y':j-1})
                    elements[di+1][j-1].color = 'green'
                    // haveWinner=owner;
                }
                if(di-3>=0 && j+3<=i && elements[di-3][j+3].owner=='free'&& (elements[di-3][j+4].owner !='free')){
                    dangerousFields.push({'x':di-3,'y':j+3})
                    elements[di-3][j+3].color = 'green'
                    // haveWinner=owner;
                }
            }
            ++di;
        }
        if(haveWinner)
            break
    }
    //Dijagonala sporedna
    for(var j =0;j<6;j++){
        var owner=null
        var count = 0
        var dj=j
        for(var i = 0;i<6-j;i++){            
            const figura = elements[i][dj]
            if('user' == figura.owner){
                ++count
            }else{
                count = 0
                owner = -1
            }
            if(count ==3){
                dangerousFields.push({'x':i,'y':dj})
                figura.color = 'green'
                // haveWinner=owner;
                // break;
            }
            ++dj;
        }
        if(haveWinner)
            break
    }
    //Dijagonala sporedna
    for(var i =1;i<6;i++){
        var owner=null
        var count = 0
        var di=i
        for(var j = 0;j<6-i;j++){
            
            const figura = elements[di][j]
            if('user' == figura.owner){
                ++count
            }else{
                count = 0
                owner = -1
            }
            if(count ==3){
                dangerousFields.push({'x':di,'y':j})
                figura.color = 'green'
                // haveWinner=owner;
                // break;
            }
            ++di;
        }
        if(haveWinner)
            break
    }
    return dangerousFields
}