import React from 'react';
import PropTypes from 'prop-types';
import {
    withStyles
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';


function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const {
            // onSelectAllClick,       
            // numSelected, 
            // rowCount, 
            order,
            orderBy,
            columns,
            idColumn
        } = this.props;

        return ( <
            TableHead >
            <
            TableRow > {
                /* <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={numSelected > 0 && numSelected < rowCount}
                              checked={numSelected === rowCount}
                              onChange={onSelectAllClick}
                            />
                          </TableCell> */
            } {
                columns.map(row => {
                    return ( <
                        TableCell key = {
                            row.id
                        }
                        numeric = {
                            row.numeric
                        }
                        padding = {
                            row.disablePadding ? 'none' : 'default'
                        }
                        sortDirection = {
                            orderBy === row[idColumn] ? order : false
                        } >
                        <
                        Tooltip title = "Sort"
                        placement = {
                            row.numeric ? 'bottom-end' : 'bottom-start'
                        }
                        enterDelay = {
                            300
                        } >
                        <
                        TableSortLabel active = {
                            orderBy === row.id
                        }
                        direction = {
                            order
                        }
                        onClick = {
                            this.createSortHandler(row.id)
                        } >
                        {
                            row.label
                        } <
                        /TableSortLabel> <
                        /Tooltip> <
                        /TableCell>
                    );
                }, this)
            } <
            /TableRow> <
            /TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

// const toolbarStyles = theme => ({
//   root: {
//     paddingRight: theme.spacing.unit,
//   },
//   highlight:
//     theme.palette.type === 'light'
//       ? {
//           color: theme.palette.secondary.main,
//           backgroundColor: lighten(theme.palette.secondary.light, 0.85),
//         }
//       : {
//           color: theme.palette.text.primary,
//           backgroundColor: theme.palette.secondary.dark,
//         },
//   spacer: {
//     flex: '1 1 100%',
//   },
//   actions: {
//     color: theme.palette.text.secondary,
//   },
//   title: {
//     flex: '0 0 auto',
//   },
// });

// let EnhancedTableToolbar = props => {
//   const { numSelected, classes } = props;

//   return (
//     <Toolbar
//       className={classNames(classes.root, {
//         [classes.highlight]: numSelected > 0,
//       })}
//     >
//       <div className={classes.title}>
//         {numSelected > 0 ? (
//           <Typography color="inherit" variant="subheading">
//             {numSelected} selected
//           </Typography>
//         ) : (
//           <Typography variant="title" id="tableTitle">
//             Nutrition
//           </Typography>
//         )}
//       </div>
//       <div className={classes.spacer} />
//       <div className={classes.actions}>
//         {numSelected > 0 ? (
//           <Tooltip title="Delete">
//             <IconButton aria-label="Delete">
//               <DeleteIcon />
//             </IconButton>
//           </Tooltip>
//         ) : (
//           <Tooltip title="Filter list">
//             <IconButton aria-label="Filter list">
//               <FilterListIcon />
//             </IconButton>
//           </Tooltip>
//         )}
//       </div>
//     </Toolbar>
//   );
// };

// EnhancedTableToolbar.propTypes = {
//   classes: PropTypes.object.isRequired,
//   numSelected: PropTypes.number.isRequired,
// };

// EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        width: '100%',
        // marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

class EnhancedTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: props.order || 'asc',
            orderBy: props.defaultSortColumn,
            selected: [],
            columns: props.columns,
            data: props.data,
            page: 0,
            rowsPerPage: 10,
            idColumn: props.idColumn || "id"
        };
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({
            order,
            orderBy
        });
    };

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState(state => ({
                selected: state.data.map(n => n[this.props.idColumn])
            }));
            return;
        }
        this.setState({
            selected: []
        });
    };

    handleClick = (event, id) => {
        const {
            selected
        } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({
            selected: newSelected
        });
    };

    handleChangePage = (event, page) => {
        this.setState({
            page
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: event.target.value
        });
    };

    // isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {
            classes,
            idColumn,
            columns
        } = this.props;
        const {
            data,
            order,
            orderBy,
            selected,
            rowsPerPage,
            page
        } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return ( <
            Paper className = {
                classes.root
            } > { /* <EnhancedTableToolbar numSelected={selected.length} /> */ } <
            div className = {
                classes.tableWrapper
            } >
            <
            Table className = {
                classes.table
            }
            aria - labelledby = "tableTitle" >
            <
            EnhancedTableHead columns = {
                columns
            }
            numSelected = {
                selected.length
            }
            order = {
                order
            }
            orderBy = {
                orderBy
            }
            onSelectAllClick = {
                this.handleSelectAllClick
            }
            onRequestSort = {
                this.handleRequestSort
            }
            rowCount = {
                data.length
            }
            /> <
            TableBody > {
                data
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                    // const isSelected = this.isSelected(n[idColumn]);
                    return ( <
                        TableRow
                        // hover
                        onClick = {
                            event => this.handleClick(event, n[idColumn])
                        }
                        // role="checkbox"
                        // aria-checked={isSelected}
                        // tabIndex={-1}
                        key = {
                            n[idColumn]
                        }
                        // selected={isSelected}
                        >
                        {
                            columns.map((col, idx) => {
                                return (
                                    col.numeric ? < TableCell key = {
                                        idx
                                    }
                                    numeric > {
                                        n[col.id]
                                    } < /TableCell> : <TableCell key={idx}>{n[col.id]}</TableCell >
                                )
                            })
                        } <
                        /TableRow>
                    );
                })
            } {
                emptyRows > 0 && ( <
                    TableRow style = {
                        {
                            height: 49 * emptyRows
                        }
                    } >
                    <
                    TableCell colSpan = {
                        6
                    }
                    /> <
                    /TableRow>
                )
            } <
            /TableBody> <
            /Table> <
            /div> <
            TablePagination rowsPerPageOptions = {
                [5, 10, 25, 50, 100, 250, 500]
            }
            component = "div"
            count = {
                data.length
            }
            rowsPerPage = {
                rowsPerPage
            }
            page = {
                page
            }
            backIconButtonProps = {
                {
                    'aria-label': 'Previous Page',
                }
            }
            nextIconButtonProps = {
                {
                    'aria-label': 'Next Page',
                }
            }
            onChangePage = {
                this.handleChangePage
            }
            onChangeRowsPerPage = {
                this.handleChangeRowsPerPage
            }
            /> <
            /Paper>
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);