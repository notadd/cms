import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("visit-appointment-table")
export class VisitEntity {
    /*参观id*/
    @PrimaryGeneratedColumn()
    id: number;

    /*姓名*/
    @Column({
        nullable: true,
        length: 50,
    })
    name: string;

    /*手机*/
    @Column({
        nullable: true,
        length: 20,
    })
    telPhone: string;

    /*微信*/
    @Column({
        nullable: true,
        length: 100,
    })
    weChat: string;

    /*邮箱*/
    @Column({
        nullable: true,
        length: 70,
    })
    email: string;

    /*公司名称*/
    @Column({
        nullable: true,
        length: 200,
    })
    companyName: string;

    /*所属行业*/
    @Column({
        nullable: true,
        length: 130,
    })
    industryInvolved: string;

    /*公司人数*/
    @Column({
        nullable: true,
        length: 30,
    })
    employees: string;

    /*预约日期*/
    @Column({
        nullable: true,
    })
    appointmentDate: Date;

    /*无用*/
    @Column({
        nullable: true,
    })
    collapse: boolean;
}
