import { RoleEntity } from 'src/modules/management/role/entity/roles.entity';
import { DataSource } from 'typeorm';
import { Role } from './enum/role';



export async function seedDatabase(dataSource: DataSource) {
    const roleRepository = dataSource.getRepository(RoleEntity);

    // Tạo và lưu các vai trò nếu chưa tồn tại
    for (const [roleName] of Object.entries(Role)) {
        let role = await roleRepository.findOne({ where: { name: roleName } });
        console.log(role)
        if (!role) {
            role = roleRepository.create({
                name: roleName,
            });
            await roleRepository.save(role);
        }
    }

    console.log("Seed data completed!");
}
