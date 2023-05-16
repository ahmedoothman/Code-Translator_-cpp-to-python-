int main(){
    int x = 6;
    int y = 0;
    while (x>0)
    {
        x --;
        if (x == 4){
            x += 4;
        }else if(x == 9 || x >= 2  && true){
            x += 4;
        }else{
            x =2;
        }
    }
    return 0;
}