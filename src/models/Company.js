// src/entities/Company.js
const { Entity, PrimaryGeneratedColumn, Column , EntitySchema } = require('typeorm');
const { v4: uuidv4 } = require('uuid');
const User = require('./User');

const Company = new EntitySchema({
    name: "Company",
    columns: {
      id: {
        primary: true,
        type: "uuid",
        generated: "uuid",
      },
      company_name: {
        type: "varchar",
      },
      description: {
        type: "varchar",
      },
      notes: {
        type: "varchar",
      },
      health_score: {
        type: "varchar",
        enum: ["Happy", "Not Happy"],
      },
      account_tier: {
        type: "varchar",
        enum: ["Basic", "Premium"],
      },
     
      company_logo:{
        type:"varchar",
        nullable:true
      }
    },
   
    relations: {
     
      
      clients: {
        type: "one-to-many",
        target: "User",
        inverseSide: "company"
      }
    },
    
    
  });
  module.exports = Company;
  
  