class ReviewRequestModel { // this will be send to the back end after Submit Review
    rating: number;
    bookId: number;
    reviewDescription: String;

    constructor(rating:number, bookId:number,reviewDescription:String){
    this.rating=rating;
    this.bookId=bookId;
    this.reviewDescription=reviewDescription;
    }

}
export default ReviewRequestModel