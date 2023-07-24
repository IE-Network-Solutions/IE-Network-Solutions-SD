const { getConnection } = require("typeorm");
const Type = require("../../models/Type");

class TypeDAL {
    // Get All Types
    static async getAllTypes() {
        try {
            // Form Connection
            const connection = getConnection();
            const typeRepository = connection.getRepository(Type);

            // Get Data
            const types = await typeRepository.find();
            return types;
        } catch (error) {
            throw error;
        }
    }

    // Get One Type
    static async getOneType(data) {
        const id = data;
        try {
            // Form Connection
            const connection = getConnection();
            const typeRepository = connection.getRepository(Type);

            // Get Data
            const foundType = await typeRepository.findBy({ id: id });
            return foundType;
        } catch (error) {
            throw error;
        }
    }

    // Create New Type
    static async createType(data) {
        try {
            // Create Type Object
            const type = data;

            // Form Connection
            const connection = getConnection();
            const typeRepository = connection.getRepository(Type);

            // Create Note
            const newType = await typeRepository.create(type);
            await typeRepository.save(newType);
            return newType;
        } catch (error) {
            throw error;
        }
    }

    // Edit Type
    static async editType(id, data) {
        try {
            // Create Type Objects
            const idType = id;
            const updatedFields = data;

            // Form Connection
            const connection = getConnection();
            const typeRepository = connection.getRepository(Type);

            const type = await typeRepository.findOneBy({ id: idType });

            // Update User
            // Update only the specified fields in the updatedFields object
            Object.keys(updatedFields).forEach((field) => {
                if (field in type) {
                    type[field] = updatedFields[field];
                }
            });
            await typeRepository.save(type);

            return type;
        } catch (error) {
            throw error;
        }
    }

    // Delete One Type
    static async deleteType(id) {
        try {
            // Form Connection
            const connection = getConnection();
            const typeRepository = connection.getRepository(Type);

            // Delete User
            const deletedType = await typeRepository.delete({ id: id });

            return "Note Deleted Successfully!";
        } catch (error) {
            throw error;
        }
    }

    // Delete All Types
    static async deleteAllTypes() {
        try {
            // Form Connection
            const connection = getConnection();
            const typeRepository = connection.getRepository(Type);

            // Get All Types
            const allTypes = await typeRepository.find();

            // Delete All Types
            const deletedTypes = await typeRepository.delete(allTypes);
            return deletedTypes;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = TypeDAL;