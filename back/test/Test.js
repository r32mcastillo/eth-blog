const { expect } = require("chai");

describe("Blog", function () {
  it("add", 
    async function deployOneYearLockFixture() {
      const [owner, otherAccount] = await ethers.getSigners();

      const Blog = await ethers.getContractFactory("Blog");
      const blog = await Blog.deploy();
      await blog.deployed();

      var addItem = await blog.addItem("Hola Mundo");
      var addItemm = await blog.addItem("Hola Mundo");
      await addItem.wait();
      await addItemm.wait();

      var addItem2 = await blog.connect(otherAccount).addItem("Hola Mundo");
      await addItem2.wait();

      await blog.addLike(2);
      await blog.addLike(2);
      await blog.addLike(2);

      var items = await blog.getAllItems();
      expect(items.length).to.equal(3);

      var time = await blog.getNow();
      console.log('======== time');
      console.log(time);


    }
  );
});
