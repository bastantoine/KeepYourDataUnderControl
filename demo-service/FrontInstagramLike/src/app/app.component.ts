import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

import { PostService } from "./post.service";
import { Post } from "./models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  allPosts: Post[];
  form_add_comment: FormGroup;

  constructor(
    private post: PostService,
    private form_builder: FormBuilder,
  ) {
    this.form_add_comment = this.form_builder.group({
      link: '',
    });
  }

  ngOnInit() {
    this.allPosts = [];
    this.getAllPosts();
  }

  getAllPosts() {
    this.post.getAllPosts().subscribe(data => this.allPosts = data.posts);
  }

  addComment(id_post: Number, data) {
    console.log(id_post, data);
  }

}
