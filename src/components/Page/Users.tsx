import { Box, Table } from "@chakra-ui/react";
import type { UserData } from "@/hooks/ws/types";
import { LuCrown } from "react-icons/lu";

interface UsersProps {
    users: UserData[] | undefined
}

export const Users: React.FC<UsersProps> = ({ users }) => {
    // Маковые данные для демонстрации
    const mockUsers: UserData[] = [
        {
            name: "Алексей Петров",
            team: "Архитекторы",
            bim_coin: 1250
        },
        {
            name: "Мария Сидорова",
            team: "Конструкторы",
            bim_coin: 980
        },
        {
            name: "Дмитрий Иванов",
            team: "Инженеры",
            bim_coin: 1560
        },
        {
            name: "Екатерина Смирнова",
            team: "Дизайнеры",
            bim_coin: 870
        },
        {
            name: "Сергей Кузнецов",
            team: "Архитекторы",
            bim_coin: 1120
        },
        {
            name: "Ольга Васильева",
            team: "Конструкторы",
            bim_coin: 1340
        },
        {
            name: "Иван Попов",
            team: "Инженеры",
            bim_coin: 920
        },
        {
            name: "Анна Новикова",
            team: "Дизайнеры",
            bim_coin: 1050
        }
    ];

    const displayUsers = users || mockUsers;

    return (
        <Box
            display={"flex"}
            width={"78%"}
            borderRadius={"26px"}
            padding={"30px"}
            paddingTop={"30px"}
            color={"#4775A6"}
            bg="#FFE4D7"
            border="1px solid"
            borderColor="#4775A6"
        >
            <Table.Root size="lg" >
                <Table.Header>
                    <Table.Row bg="transparent">
                        <Table.ColumnHeader fontSize={"30px"} w={"300px"} color={"#4775A6"} fontWeight={"bold"} textAlign="left">Имя:</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize={"30px"} w={"300px"} color={"#4775A6"} fontWeight={"bold"} textAlign="center">Команда:</Table.ColumnHeader>
                        <Table.ColumnHeader fontSize={"30px"} w={"300px"} color={"#4775A6"} fontWeight={"bold"} textAlign="right">BIMCOIN:</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {displayUsers?.map((user) => (
                        <Table.Row bg="transparent" key={user.name}>
                            <Table.Cell
                                display={"flex"}
                                marginTop={"5px"}
                                textAlign="left"
                                alignItems="center"
                                gap="8px"
                                fontSize={"18px"}
                            >
                                {user.team_leader && <LuCrown color="gold" />}
                                {user.name}
                            </Table.Cell>
                            <Table.Cell fontSize={"18px"} marginTop={"5px"} textAlign="center">{user.team}</Table.Cell>
                            <Table.Cell fontSize={"18pxa"} marginTop={"5px"} textAlign="right">{user.bim_coin}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
}