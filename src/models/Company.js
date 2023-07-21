// src/entities/Company.js
const { Entity, PrimaryGeneratedColumn, Column , EntitySchema } = require('typeorm');
const { v4: uuidv4 } = require('uuid');

// @Entity()
// class Company {
//   @PrimaryGeneratedColumn('uuid')
//   id = uuidv4();

//   @Column()
//   companyName;

//   @Column()
//   description;

//   @Column()
//   notes;

//   @Column({ type: 'enum', enum: ['Happy', 'Not Happy'] })
//   healthScore;

//   @Column({ type: 'enum', enum: ['Basic', 'Premium'] })
//   accountTier;
// }

// module.exports = { Company };

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
    }
    
  });
  
  module.exports = Company;
  