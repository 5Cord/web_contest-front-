import { Box, Table } from "@chakra-ui/react";
import type { UserData } from "@/hooks/ws/types";
import styles from "../ui/Content.module.css"; // Импортируем стили

interface UsersProps {
    users: UserData[] | undefined
}

export const Users: React.FC<UsersProps> = ({ users }) => {
    return (
        <div className={styles.contentContainer}>
            <Box
                display={"flex"}
                borderRadius={"26px"}
                padding={"30px"}
                paddingTop={"30px"}
                color={"#4775A6"}
                bg="#FFE4D7"
                border="1px solid"
                borderColor="#4775A6"
                width="100%"
            >
                <Table.Root>
                    <Table.Header>
                        <Table.Row bg="transparent">
                            <Table.ColumnHeader fontSize={"30px"} w={"300px"} color={"#4775A6"} fontWeight={"bold"} textAlign="left">Имя:</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize={"30px"} w={"300px"} color={"#4775A6"} fontWeight={"bold"} textAlign="center">Команда:</Table.ColumnHeader>
                            <Table.ColumnHeader fontSize={"30px"} w={"300px"} color={"#4775A6"} fontWeight={"bold"} textAlign="right">BIMCOIN:</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {users?.map((user) => (
                            <Table.Row bg="transparent" key={user.name}>
                                <Table.Cell
                                    display={"flex"}
                                    marginTop={"5px"}
                                    textAlign="left"
                                    alignItems="center"
                                    gap="8px"
                                    fontSize={"18px"}
                                >
                                    {user.name}
                                </Table.Cell>
                                <Table.Cell fontSize={"18px"} marginTop={"5px"} textAlign="center">{user.team}</Table.Cell>
                                <Table.Cell fontSize={"18px"} marginTop={"5px"} textAlign="right">{user.bim_coin}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </div>
    );
}