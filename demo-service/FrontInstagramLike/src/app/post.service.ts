import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { ApiService } from "./api.service";
import { Post } from "./models";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private api: ApiService) { }

  getAllPosts(): Observable<{'posts': Post[]}> {
    return this.api.get('posts')
  }

  createPost(link: String): Observable<Post> {
    return this.api.post<Post>("posts", {"link": link});
  }
}
