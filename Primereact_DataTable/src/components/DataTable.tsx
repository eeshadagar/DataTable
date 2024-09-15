import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable as PrimeDataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css' ;

function DataTable() {
    interface TodoItem {
        id: number;
        place_of_origin: string;
        title: string;
        artist_display: string;
        inscriptions: string;
        date_start: number;
        date_end: number;
    }

    const [rowClick, setRowClick] = useState(true);
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [selectedTodos, setSelectedTodos] = useState<TodoItem[]>([]);
    const [numRows, setNumRows] = useState<number>(0);
    const op = useRef<any>(null);

    useEffect(() => {
        axios.get<TodoItem[]>("https://api.artic.edu/api/v1/artworks?page=1")
            .then((response) => setTodos(response.data.data));
    }, []);

    const handleSelectRows = () => {
        const rowsToSelect = Math.min(numRows, todos.length);
        const newSelection = todos.slice(0, rowsToSelect);
        setSelectedTodos(newSelection);
        op.current.hide(); 
    };

    const headerTemplate = () => {     
        return (
            <div className="flex align-items-center justify-content-between" style={{ display: 'flex' }}>
                <div className="flex align-items-center">
                    <i
                        className="pi pi-angle-down"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => op.current.toggle(e)}
                    ></i>
                    <OverlayPanel ref={op} style={{ padding: '10px' }}>
                        <div className="p-fluid">
                            <div className="p-field">
                                <InputText
                                    value={numRows}
                                    onChange={(e) => setNumRows(parseInt(e.target.value))}
                                    type="number"
                                    placeholder="Number of Rows"
                                />
                            </div>
                            <Button label="Submit" onClick={handleSelectRows} />
                        </div>
                    </OverlayPanel>
                </div>
                <div className="flex justify-content-center align-items-center mb-4" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <InputSwitch
                    inputId="input-rowclick"
                    checked={rowClick}
                    onChange={(e) => setRowClick(e.value)}
                    className="mr-2"
                />
                <label htmlFor="input-rowclick">Row Click</label>
                </div>
            </div>
        );
    };

    return (
        <div className="card flex flex-column align-items-center">

            <PrimeDataTable
                value={todos}
                stripedRows
                showGridlines
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                selectionMode={rowClick ? null : 'checkbox'}
                selection={selectedTodos}
                onSelectionChange={(e) => setSelectedTodos(e.value)}
                dataKey="id"
                tableStyle={{ minWidth: '50rem' }}
                header={headerTemplate()} 
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist Display" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </PrimeDataTable>
        </div>
    );
}

export default DataTable;
