import { HttpHeaders } from '@angular/common/http';
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

  createPost(file: File): Observable<Post> {
    // We shouldn't set a ContentType Header, so that the boundary is correctly set upon sending
    // https://stackoverflow.com/a/40362274/10104112
    return this.api.post<Post>("posts", this.api.generateFormDataForFile(file), new HttpHeaders());
  }

  deletePost(id_post): Observable<Object> {
    return this.api.delete(["posts", String(id_post)]);
  }

  editPost(id_post: Number, new_file: File): Observable<Post> {
    return this.api.put(["posts", String(id_post)], this.api.generateFormDataForFile(new_file), new HttpHeaders());
  }

}
