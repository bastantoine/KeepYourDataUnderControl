import { Component, OnInit, Injector } from '@angular/core';
import { createCustomElement } from "@angular/elements";
import { FormBuilder, FormGroup } from "@angular/forms";
import { faPlus, faTrashAlt, faPencilAlt, faCheck } from "@fortawesome/free-solid-svg-icons";

import { EImgComponent } from "./html-elements/e-img/e-img.component";
import { ETxtComponent } from "./html-elements/e-txt/e-txt.component";
import { EVidComponent } from './html-elements/e-vid/e-vid.component';
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
  faPencilAlt = faPencilAlt;
  faCheck = faCheck;

  // This is used to know whether or not an edit form is shown. It is
  // instantiated in the constructor, but populated when we have fetched all
  // forms and comments from the API.
  // It should look like this:
  // {
  //   'post': [
  //     1 -> false, // This means the edit form of the post of id 1 is not shown at the moment
  //     2 -> false,
  //     3 -> true,
  //     ...
  //   ],
  //   'comment': [
  //     1 -> false,
  //     2 -> true, // This means the edit form of the comment of id 2 is shown right now
  //     3 -> false,
  //     ...
  //   ]
  // }

  isEditFormShown: Map<string, Map<number, boolean>>;
  // This is used to store all edit forms for the posts and comments. It is
  // instantiated in the constructor, but populated when we have fetched all
  // forms and comments from the API.
  // It should look like this:
  // {
  //   1 -> {
  //     'form': <edit form of post 1>,
  //     'comments': [
  //       1 -> <edit form of comment 1>,
  //       2 -> <edit form of comment 2>,
  //       ...
  //     ]
  //   },
  //   2 -> {
  //     'form': <edit form of post 2>,
  //     'comments': [
  //       1 -> <edit form of comment 3>,
  //       ...
  //     ]
  //   },
  // }
  editForms: Map<number, {form: FormGroup, comments: Map<number, FormGroup>}>

  allPosts: Post[];
  form_add_comment: FormGroup;
  form_add_post: FormGroup;

  fileToUpload: File;

  constructor(
    private post: PostService,
    private comment: CommentService,
    private form_builder: FormBuilder,
    private injector: Injector,
  ) {
    this.fileToUpload = null;

    this.isEditFormShown = new Map<string, Map<number, boolean>>([
      ["post", new Map<number, boolean>()],
      ["comment", new Map<number, boolean>()],
    ]);
    this.editForms = new Map();
    this.form_add_comment = this.form_builder.group({
      link: '',
    });
    this.form_add_post = this.form_builder.group({
      link: ''
    })

    const eImgElement = createCustomElement(EImgComponent, {injector});
    customElements.define("e-img", eImgElement);

    const eTxtElement = createCustomElement(ETxtComponent, {injector});
    customElements.define("e-txt", eTxtElement);

    const eVidElement = createCustomElement(EVidComponent, {injector});
    customElements.define("e-vid", eVidElement);
  }

  ngOnInit() {
    this.allPosts = [];
    this.getAllPosts();
  }

  getAllPosts() {
    this.post.getAllPosts().subscribe(data => {
      this.allPosts = data.posts;
      this.allPosts.forEach(post => {
        // On first load, the edit form is not shown
        this.isEditFormShown.get("post").set(post.id, false);

        // Create the edit form, but don't fill it, as it has a file input that
        // doesn't allow to be prefilled
        let form_post = this.form_builder.group({'link': ''});
        this.editForms.set(post.id, {
          form: form_post,
          comments: new Map()
        })
        post.comments.forEach(comment => {
          // On first load, the edit form is not shown
          this.isEditFormShown.get("comment").set(comment.id, false);

          // Create the edit form already filled with the link the text of the comment
          let form_comment = this.form_builder.group({'link': comment.link});
          this.editForms.get(post.id).comments.set(comment.id, form_comment)
        });
      });
    });
  }

  onFileChange(event: { target: { files: File[]; }; }) {
    // From https://stackoverflow.com/a/47938117
    if(event.target.files && event.target.files.length) {
      this.fileToUpload = event.target.files[0]
    }
  }

  addComment(id_post: number, data: {"link": string}) {
    if(data.link !== "") {
      this.comment.createCommentOnPost(id_post, data.link).subscribe(() => window.location.reload())
    }
  }

  addPost() {
    if (this.fileToUpload !== null) {
      this.post.createPost(this.fileToUpload).subscribe(() => window.location.reload());
    }
  }

  deleteComment(id_comment: number) {
    this.comment.deleteComment(id_comment).subscribe(() => window.location.reload());
  }

  deletePost(id_post: number) {
    this.post.deletePost(id_post).subscribe(() => window.location.reload());
  }

  isFormDisplayed(type: string, id: number) {
    let val = this.isEditFormShown.get(type).get(id);
    return val !== undefined ? val : false;
  }

  toggleForm(type: string, id: number) {
    // type should either be "post" of "comment"
    // id is the id of the model for which we want the edit form
    let val = this.isEditFormShown.get(type).get(id);
    this.isEditFormShown.get(type).set(id, val !== undefined ? !val : false);
  }

  getEditForm(type: string, id: number) {
    // type should either be "post" of "comment"
    // id is the id of the model for which we want the edit form
    let form: FormGroup;
    this.editForms.forEach((form_post, index_post) => {
      if (type === "post" && id === index_post) {
        // We want the edit form of a post and we have
        // found one whose id match the one we got
        form = form_post.form;
      } else if (type === "comment") {
        form_post.comments.forEach((form_comment, index_comment) => {
          if (id === index_comment) {
            // We want the edit form of a comment and we have
            // found one whose id match the one we got
            form = form_comment;
          }
        });
      }
    });
    return form;
  }

  editComment(id_comment: number, data: {'link': string}) {
    this.comment.editComment(id_comment, data.link).subscribe(() => window.location.reload());
  }

  editPost(id_post: number) {
    if (this.fileToUpload !== null) {
      this.post.editPost(id_post, this.fileToUpload).subscribe(() => window.location.reload());
    }
  }

}
