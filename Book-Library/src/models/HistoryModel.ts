class HistoryModal {
    id: number;
    userEmail: string;
    returnedDate: string;
    checkoutDate: string;
    title: string;
    author: string;
    description:String;
    img: string
    constructor(id: number, userEmail: string,checkoutDate:string,description:String,returnedDate: string, title: string, author: string, img: string) {
        this.id = id;
        this.author = author;
        this.checkoutDate = checkoutDate;
        this.author = author;
        this.returnedDate = returnedDate;
        this.img=img;
        this.userEmail=userEmail;
        this.title=title;
        this.description=description;
    }
}
export default HistoryModal;