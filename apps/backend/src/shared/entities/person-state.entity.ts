import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { PersonEntity } from './person.entity';

@Entity('person_states')
export class PersonStateEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'boolean', default: false })
    isOnline: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastActiveAt: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    status: string; // 'online', 'away', 'offline', 'busy'

    @Column({ type: 'jsonb', nullable: true })
    state: any; // Добавьте это поле для хранения состояния

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @OneToOne(() => PersonEntity, (person) => person.state)
    @JoinColumn({ name: 'personId' })
    person: PersonEntity;

    @Column({ unique: true })
    personId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
