import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { ApiService } from "./api.service";
import { Comment } from "./models";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private api: ApiService) { }

  createCommentOnPost(id_post: Number, comment: String): Observable<Comment> {
    return this.api.post<Comment>(["posts", String(id_post), "comments"], {"comment": comment});
  }

  deleteComment(id_comment): Observable<Object> {
    return this.api.delete(["comments", String(id_comment)]);
  }

  editComment(id_comment: Number, new_comment: String): Observable<Comment> {
    return this.api.put(["comments", String(id_comment)], {'comment': new_comment});
  }

}
