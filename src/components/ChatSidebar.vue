<template>
  <div class="col-12 col-lg-5 col-xl-3 border-end">
  
  <div class="px-4 d-none d-md-block">
      <div class="d-flex align-items-center">
          <div class="flex-grow-1">
              <div class="input-group mt-3">
               
                  <input list="browsers" v-model="searchEmail" @input="searchUsers" type="text" class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
                  <datalist id="browsers">
                      <option v-for="user in users" :key="user.email">{{ user.email }}</option>
                  </datalist>
                  <button class="btn btn-outline-secondary" :class="{isSendingForm:disabled}" type="button" @click="onSubmit" id="button-addon1">start</button>
              </div>
          </div>
      </div>
  </div>
  
  
  <a v-for="chat in chats" @click="OpentChat(chat.id)" :key="chat.id"  class="list-group-item list-group-item-action border-0  ps-3 py-3" >
      <div class="d-flex align-items-start">
          <img src="http://localhost:5173/img/avatar-7.png" class="rounded-circle me-1" alt="Vanessa Tucker" width="40" height="40">
          <div class="flex-grow-1 ml-3 fw-bold">
              <span v-for="participant in chat.participants" :key="participant.id">
                  <span v-if="$store.state.id != participant.id" >{{ participant.first_name }} {{ participant.last_name }}</span>
             </span>
          </div>
      </div>
  </a>
  
  </div>
  </template>
  <script>
  import axios from 'axios'
  export default {
     // to user the renderChat message from the parent component chat.vue
    emits: ["renderChat"],
    data(){
      return{
        chat_id:null,
        chats:[],
        isSendingForm:false,
              users:[],
              searchEmail:'',
              isSendingForm:false,
      }
    },
    methods:{
      // to start open a chat in ChatBox.vue
     async OpentChat(chat_id){
          // disconnect the current chat channel
          await window.Echo.leave('chat.'+this.chat_id)
  
          //open the new chat
          this.chat_id = chat_id
          this.$emit("renderChat", chat_id);
      },
     
      // to search users by email
     searchUsers() {
        this.isSendingForm = true;
        axios.post(
          this.$store.state.backendUrl+'/chat/search-user',{email:this.searchEmail}, 
          {
          headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + this.$store.state.token,
          }
        })
        .then((response) => {
            console.log(response);
            this.isSendingForm = false;
            this.users = response.data.users
        })
        .catch( (error) => {
            console.log(error);
            this.isSendingForm = false;
        });
      },
  
      // to get the user's chats to be displayed on the sidbar
      getData(){
        let url =import.meta.env.VITE_BACKEND_URL+'/chat/get-chats'
        axios
        .get(url,
      { headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.$store.state.token,
      }},
      )
        .then((response) => {
          console.log(response.data.chats)
          this.chats = response.data.chats
        });
      },
  
  
    // to start a chat with  user
    async  onSubmit() {
         this.isSendingForm = true;
         let user = this.users.find(o => o.email === this.searchEmail);
         var data= new FormData();
         data.append('users[]', user.id);
         data.append('isPrivate', 1);
         axios.post(
          this.$store.state.backendUrl+'/chat/create-chat',data, 
          {
        headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + this.$store.state.token,
        }
        })
        .then((response) => {
           // to start a chat with the user
          this.isSendingForm = false;
          this.OpentChat(response.data.chat.id)
        })
        .catch( (error) => {
          console.log(error);
          this.isSendingForm = false;
        });
      },
      },
      mounted(){
      this.getData()
    }
  
  }
  </script>