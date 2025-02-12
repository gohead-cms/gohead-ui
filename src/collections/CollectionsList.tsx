// File: src/resources/CollectionShow.tsx
import { useState } from "react";
import { TextField, Datagrid, useGetList, useGetOne } from "react-admin";
import { CardContent, Grid, Typography } from "@mui/material";


import { Card, List, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"; // Small dot icon

const CollectionListSidebar = ({ onSelect }: { onSelect: (name: string) => void }) => {
    const { data, isLoading } = useGetList("collections");

    if (isLoading) return <Typography>Loading collections...</Typography>;
    if (!data || data.length === 0) return <Typography>No collections available.</Typography>;

    return (
        <Card sx={{ height: "100%", overflowY: "auto" }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Content Manager
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "gray", marginBottom: 1, marginTop: 5 }}>
                    Collections
                </Typography>
                <List>
                    {data.map((collection) => (
                        <ListItemButton
                            key={collection.id}
                            onClick={() => onSelect(collection.name)}
                        >
                            <ListItemIcon>
                                <FiberManualRecordIcon sx={{ fontSize: 10, color: "gray" }} />
                            </ListItemIcon>
                            <ListItemText primary={collection.name} />
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};


// Right Side - Collection Content
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const CollectionContent = ({ selectedCollection }: { selectedCollection: string }) => {
    const { data, isLoading } = useGetList(selectedCollection);

    console.log("Selected Collection:", selectedCollection);
    console.log("Data:", data);

    if (isLoading) return <Typography>Loading collection content...</Typography>;
    if (!data || data.length === 0) return <Typography>Select a collection to view its content</Typography>;

    // Extract attributes dynamically
    const attributes = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <Card sx={{ height: "100%", overflowY: "auto", padding: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>{selectedCollection} Content</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        {/* Table Header */}
                        <TableHead>
                            <TableRow>
                                {attributes.map((attr) => (
                                    <TableCell key={attr} sx={{ fontWeight: "bold" }}>{attr}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        {/* Table Body */}
                        <TableBody>
                            {data.map((record: any, index: number) => (
                                <TableRow key={index}>
                                    {attributes.map((attr) => (
                                        <TableCell key={`${index}-${attr}`}>{record[attr]}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};



export const CollectionList = () => {
    const [selectedCollection, setSelectedCollection] = useState<string>(null);

    return (
        <Grid container spacing={3} sx={{ height: "100vh", padding: "0" }}>
            {/* Left Side: Collections List */}
            <Grid item xs={2}>
                <CollectionListSidebar onSelect={setSelectedCollection} />
            </Grid>

            {/* Right Side: Collection Content */}
            <Grid item xs={10}>
                <CollectionContent selectedCollection={selectedCollection} />
            </Grid>
        </Grid>
    );
};


export default CollectionList; 
