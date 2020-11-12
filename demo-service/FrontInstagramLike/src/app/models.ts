export class Post {
    id: number;
    link: string;
    comments: Comment[];

    constructor(
        id: number,
        link: string,
        comments?: Comment[]
    ) {
        this.id = id;
        this.link = link;
        this.comments = comments ? comments : [];
    }
}

export class Comment {
    id: number;
    link: string

    constructor(
        id: number,
        link: string,
    ) {
        this.id = id
        this.link = link
    }
}
