class User {
  constructor() {
    this.user = {
      id: new Date.time()
    };
  }

  getUser(){
    return this.user;
  }
};

export { User };