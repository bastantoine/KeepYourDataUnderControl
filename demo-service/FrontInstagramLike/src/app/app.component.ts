import { Component, OnInit } from '@angular/core';

import { PostService } from "./post.service";
import { Post } from "./models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  allPosts: Post[];

  constructor(private post: PostService) { }

  ngOnInit() {
    this.allPosts = [];
    this.getAllPosts();
  }

  getAllPosts() {
    this.post.getAllPosts().subscribe(data => this.allPosts = data.posts);
  }

}
