import React, { Component, PropTypes } from "react";

import AddFieldPickerSidePanel from "./AddFieldPickerSidePanel.jsx";
import CustomFieldSidePanel from "./CustomFieldSidePanel.jsx";
import JoinTableSidePanel from "./JoinTableSidePanel.jsx";
import PickBaseTableSidePanel from "./PickBaseTableSidePanel.jsx";
import TableFieldsManagerSidePanel from "./TableFieldsManagerSidePanel.jsx";

import NameAndDescription from "./NameAndDescription.jsx";
import Filters from "./Filters.jsx";
import Table from "metabase/visualizations/Table.jsx";


export default class VirtualTableEditor extends Component {

    static propTypes = {
        virtualTable: PropTypes.object,
        databaseMetadata: PropTypes.object,
        previewData: PropTypes.object
    };

    renderSidePanel() {
        const panels = {
            picking: AddFieldPickerSidePanel,
            custom: CustomFieldSidePanel,
            join: JoinTableSidePanel
        };

        let SidePanel;
        if (!this.props.virtualTable || !this.props.virtualTable.table_id) {
            // user hasn't picked the starting table yet, so force that to happen now
            SidePanel = PickBaseTableSidePanel;
        } else if (this.props.showAddFieldPicker) {
            // user is adding a field of some sort
            SidePanel = panels[this.props.showAddFieldPicker];
        } else {
            // we are just showing the default field management side panel
            SidePanel = TableFieldsManagerSidePanel;
        }

        return (
            <SidePanel {...this.props} />
        );
    }

    render() {
        const { metadata, previewData, virtualTable } = this.props;

        return (
            <div style={{height: "100%"}} className="">
                <div className="wrapper pt4 pb2 flex flex-row">
                    <div className="VirtualTableSidePanel full">
                        {this.renderSidePanel()}
                    </div>

                    <div className="VirtualTableMainContent full">
                        { virtualTable && virtualTable.table_id &&
                            <NameAndDescription 
                                name={virtualTable.name} 
                                description={virtualTable.description} 
                                namePlaceholder="Give your table a name"
                                descriptionPlaceholder="Give your table a description" 
                                onChange={(name, description) => this.props.setNameAndDescription(name, description)}
                            />
                        }

                        { virtualTable && metadata.tableMetadata &&
                            <div className="bordered rounded p2 my2">
                                <Filters
                                    filters={virtualTable.filters}
                                    tableMetadata={metadata.tableMetadata.table}
                                    onChange={(filters) => this.props.setFilters(filters)}
                                />
                            </div>
                        }

                        { previewData && false &&
                            <Table
                                card={{display: "table", dataset_query: {type: "query", query: {aggregation: ["rows"]}}}}
                                data={previewData.data}
                            />
                        }
                    </div>
                </div>
                <div className="wrapper py2 border-top flex align-center justify-between">
                    <div className="text-brand">
                        <a className="link">Help</a>
                    </div>

                    <div>
                        <a className="text-grey-3 text-bold">Cancel</a>
                        <a className="Button ml3">Create Table</a>
                    </div>
                </div>
            </div>
        );
    }
}
