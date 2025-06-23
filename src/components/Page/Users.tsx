import { Box, Table } from "@chakra-ui/react";
import type { UserData } from "@/hooks/ws/types";
import { LuCrown } from "react-icons/lu";

interface UsersProps {
    users: UserData[] | undefined
}

export const Users: React.FC<UsersProps> = ({ users }) => {
    return (
        <Box
            borderRadius={"28px"}
        >
            <Table.Root size="lg" interactive>
                <Table.Header>
                    <Table.Row >
                        <Table.ColumnHeader w={"300px"} textAlign="left">Имя:</Table.ColumnHeader>
                        <Table.ColumnHeader w={"300px"} textAlign="center">Комманда:</Table.ColumnHeader>
                        <Table.ColumnHeader w={"300px"} textAlign="right">BIMCOIN:</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {users?.map((user, i) => (
                        <Table.Row
                            background={
                                i === 0 ? "#F5D70050" :
                                    i === 1 ? "#A0A0A050" :
                                        i == 2 ? "#E9B08A50" :
                                            "#fffff00"
                            }
                            key={user.username}
                        >
                            <Table.Cell
                                display={"flex"} marginTop={"5px"} textAlign="left"
                            >
                                {user.team_leader && <LuCrown />}
                                {user.username}
                            </Table.Cell>
                            <Table.Cell marginTop={"5px"} textAlign="center">{user.team}</Table.Cell>
                            <Table.Cell marginTop={"5px"} textAlign="right">{user.bim_coin}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
}