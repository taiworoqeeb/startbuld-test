import { ApiProperty } from "@nestjs/swagger";


export class readNotificationDto {
    @ApiProperty({
        description: "Update Notification Status",
        type: Boolean,
        default: false
    })
    read: boolean;
}

export class addNotificationDto {
    title: string;
    message: string;
    userId: string;
    type: string;
    typeId: string;
}
