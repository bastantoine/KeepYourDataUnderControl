import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { faPlus, faTrashAlt, faPencilAlt, faCheck } from "@fortawesome/free-solid-svg-icons";

import { PostService } from "./post.service";
import { CommentService } from "./comment.service";
import { Post, Comment } from "./models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  faPlus = faPlus;
  faTrashAlt = faTrashAlt;
  faPencilAlt = faPencilAlt;
  faCheck = faCheck;

  isEditFormShown: Map<String, Map<Number, Boolean>>;
  editForms: Map<Number, {form: FormGroup, comments: Map<Number, FormGroup>}>

  allPosts: Post[];
  form_add_comment: FormGroup;
  form_add_post: FormGroup;

  constructor(
    private post: PostService,
    private comment: CommentService,
    private form_builder: FormBuilder,
  ) {
    this.isEditFormShown = new Map<String, Map<Number, Boolean>>([
      ["post", new Map<Number, Boolean>()],
      ["comment", new Map<Number, Boolean>()],
    ]);
    this.editForms = new Map();
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
    this.post.getAllPosts().subscribe(data => {
      this.allPosts = data.posts;
      this.allPosts.map(post => {
        let form_post = this.form_builder.group({'link': post.link});
        this.isEditFormShown.get("post").set(post.id, false);
        this.editForms.set(post.id, {
          form: form_post,
          comments: new Map()
        })
        post.comments.map(comment => {
          this.isEditFormShown.get("comment").set(comment.id, false);
          let form_comment = this.form_builder.group({'link': comment.link});
          this.editForms.get(post.id).comments.set(comment.id, form_comment)
        });
      });
    });
  }

  addComment(id_post: Number, data: {"link": String}) {
    if(data.link !== "") {
      this.comment.createCommentOnPost(id_post, data.link).subscribe(() => window.location.reload())
    }
  }

  addPost(data: {"link": String}) {
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

  isFormDisplayed(type: String, id: Number) {
    let val = this.isEditFormShown.get(type).get(id);
    return val !== undefined ? val : false;
  }

  toggleForm(type: String, id: Number) {
    let val = this.isEditFormShown.get(type).get(id);
    this.isEditFormShown.get(type).set(id, val !== undefined ? !val : false);
  }

  getEditForm(type: String, id: Number) {
    let form: FormGroup;
    this.editForms.forEach((val, index) => {
      if (type === "post" && id === index) {
        form = val.form;
      } else if (type === "comment") {
        val.comments.forEach((val, index) => {
          if (id === index) {
            form = val;
          }
        });
      }
    });
    return form;
  }

  editComment(id_comment: Number, data: {'link': String}) {
    this.comment.editComment(id_comment, data.link).subscribe(() => window.location.reload());
  }

  editPost(id_post: Number, data: {'link': String}) {
    this.post.editPost(id_post, data.link).subscribe(() => window.location.reload());
  }

}
