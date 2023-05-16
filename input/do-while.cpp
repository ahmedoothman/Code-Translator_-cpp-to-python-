int main(){
    int x = 6;
    do{
        x =x-1;
        if (x == 4){
            x += 4;
        }else if(x == 9 || x >= 2  && true){
            x += 4;
        }else{
            x =2;
        }
    }while(x < 4);
    return 0;
}