const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("Messenger", function () {
  let Messenger;
  let messenger;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    Messenger = await ethers.getContractFactory("Messenger");
    messenger = await Messenger.deploy();
  });

  describe("Registration", function () {
    it("Should register a user correctly", async function () {
      const name = "Alice";
      const password = "password123";

      await messenger.connect(user1).register(name, password);
      const isRegistered = await messenger.connect(user1).isRegistered();
      expect(isRegistered).to.equal(name);
    });

    it("Should hash the password during registration", async function () {
      const password = "securePass";
      await messenger.connect(user1).register("Bob", password);

      const hashedPassword = await messenger.getHashedPass(user1.address);
      expect(hashedPassword).to.not.equal(password); // Ensure the password is hashed
    });

    it("Should not register users with duplicate name",async function () {
      await messenger.connect(user1).register("Bablu", "xyz");
      await expect(messenger.connect(user2).register("Bablu", "tyu"))
          .to.be.revertedWith("Username not available");
    })
  });

  describe("Search User",function(){
    beforeEach(async function () {
      await messenger.connect(user1).register("Ali", "123");
      await messenger.connect(user2).register("Bablu", "456");
    });

    it("Should return the user details correctly", async function () {
      const user = await messenger.searchUser("Ali");
      expect(user.Name).to.equal("Ali");
    });

    it("Should check if searched username exists", async function () {
      await expect(messenger.searchUser("Alibaba"))
          .to.be.revertedWith("No user found");
    });
  })

  describe("Message Sending", function () {
    beforeEach(async function () {
      await messenger.connect(user1).register("Alice", "password123");
      await messenger.connect(user2).register("Bob", "password456");
    });

    it("should not send an empty message", async function () {
      await expect(messenger.connect(user1).send(user2.address, ""))
          .to.be.revertedWith("No message is sent");
    });

    it("Should send a message correctly", async function () {
      const message = "Hello, Bob!";
      await expect(messenger.connect(user1).send(user2.address, message))
        .to.emit(messenger, "newMessage")
        .withArgs(user2.address, anyValue);

      const messages = await messenger
        .connect(user1)
        .getMessages(user2.address);
      expect(messages[0].message).to.equal(message);
    });

    it("Should store the message for both sender and receiver", async function () {
      const message = "Hi!";
      await messenger.connect(user1).send(user2.address, message);

      const messagesForSender = await messenger
        .connect(user1)
        .getMessages(user2.address);
      const messagesForReceiver = await messenger
        .connect(user2)
        .getMessages(user1.address);

      expect(messagesForSender[0].message).to.equal(message);
      expect(messagesForReceiver[0].message).to.equal(message);
    });
    
  });
  

  describe("Password Validation", function () {
    beforeEach(async function () {
      await messenger.connect(user1).register("Ali", "123");
    });

    it("Should return true for correct password", async function () {
      const isValid = await messenger
        .connect(user1)
        .checkPass("123");
      expect(isValid).to.be.true;
    });

    it("Should return false for incorrect password", async function () {
      const isValid = await messenger
        .connect(user1)
        .checkPass("wrongPassword");
      expect(isValid).to.be.false;
    });
  });

  describe("Message Retrieval", function () {
    beforeEach(async function () {
      await messenger.connect(user1).register("Alice", "password123");
      await messenger.connect(user2).register("Bob", "password456");
      await messenger.connect(user1).send(user2.address, "Hello, Bob!");
    });

    it("Should retrieve messages between two users", async function () {
      const messages = await messenger
        .connect(user1)
        .getMessages(user2.address);

      expect(messages.length).to.equal(1);
      expect(messages[0].message).to.equal("Hello, Bob!");
    });
  });
  describe('Delete Contact', async function() { 
    it("should delete a contact and its messages", async function () {
        beforeEach(async function () {
          await messenger.connect(user1).register("Alice", "password123");
          await messenger.connect(user2).register("Bob", "password456");
        });
        
        await messenger.connect(user1).send(user2.address, "Hello, Bob!");
        let contacts = await messenger.connect(user1).getAllConnectedContacts();
        const messagesBefore = await messenger.connect(user1).getMessages(user2.address);
        expect(messagesBefore.length).to.equal(1);
        expect(contacts.length).to.equal(1);

        await messenger.connect(user1).deleteContact(user2.address);

        const messagesAfter = await messenger.connect(user1).getMessages(user2.address);
        expect(messagesAfter.length).to.equal(0);

        contacts = await messenger.connect(user1).getAllConnectedContacts();
        expect(contacts.length).to.equal(0);
    });

    it("should revert if deleting a non-existent contact", async function () {
        await expect(messenger.connect(user1).deleteContact(user2.address))
            .to.be.revertedWith("User not Connected yet");
    });
   })
});
