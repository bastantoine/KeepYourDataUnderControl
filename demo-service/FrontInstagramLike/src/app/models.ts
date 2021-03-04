export class Post {
    id: number;
    filename: string;
    comments: Comment[];

    constructor(
        id: number,
        filename: string,
        comments?: Comment[]
    ) {
        this.id = id;
        this.filename = filename;
        this.comments = comments ? comments : [];
    }
}

export class Comment {
    id: number;
    comment: string

    constructor(
        id: number,
        comment: string,
    ) {
        this.id = id
        this.comment = comment
    }
}
