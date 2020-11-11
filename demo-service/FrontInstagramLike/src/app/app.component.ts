import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { PostService } from "./post.service";
import { CommentService } from "./comment.service";
import { Post } from "./models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  faPlus = faPlus;
  faTrashAlt = faTrashAlt;

  allPosts: Post[];
  form_add_comment: FormGroup;
  form_add_post: FormGroup;

  constructor(
    private post: PostService,
    private comment: CommentService,
    private form_builder: FormBuilder,
  ) {
    this.form_add_comment = this.form_builder.group({
      link: '',
    });
    this.form_add_post = this.form_builder.group({
      link: ''
    })
  }

  ngOnInit() {
    this.allPosts = [];
    this.getAllPosts();
  }

  getAllPosts() {
    this.post.getAllPosts().subscribe(data => this.allPosts = data.posts);
  }

  addComment(id_post: Number, data) {
    if(data.link !== "") {
      this.comment.createCommentOnPost(id_post, data.link).subscribe(() => window.location.reload())
    }
  }

  addPost(data) {
    if (data.link !== "") {
      this.post.createPost(data.link).subscribe(() => window.location.reload());
    }
  }

  deleteComment(id_comment: Number) {
    this.comment.deleteComment(id_comment).subscribe(() => window.location.reload());
  }

  deletePost(id_post: Number) {
    this.post.deletePost(id_post).subscribe(() => window.location.reload());
  }

}
