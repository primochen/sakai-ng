import { Component, OnInit } from '@angular/core';
import { Product } from '../../../api/product';
import { ProductService } from '../../../service/productservice';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl: './user-detail.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../../../assets/demo/badges.scss']
})
export class UserDetailComponent implements OnInit {

    productDialog: boolean;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[];

    product: Product;

    selectedProducts: Product[];

    submitted: boolean;

    cols: any[];

    statuses: any[];

    rowsPerPageOptions = [5, 10, 20];

    cities: City[];

    nodes: any[];

    selectedCityCodes: string[];

    userDetailForm = this.fb.group({
        // username: ['', [Validators.required]],
        // password: ['', [Validators.required]],
        // rememberMe: [false],
        myRadio: ['Option 1', []], // This set default value
        dob: ['', []], // This set default value
        enable: ['', []],
        doadminb: ['', []],
        admin: ['', []],
        selectedCityCodes: ['', []],
        selectedNode: ['', []],
        selectedNodeA: ['', []],
      });

    constructor(private productService: ProductService, private messageService: MessageService,
                private router: Router,
                private fb: FormBuilder,
                private confirmationService: ConfirmationService) {
                    this.cities = [
                        {name: '訪客', code: 'NY'},
                        {name: '管理員', code: 'RM'},
                        {name: '超級管理員', code: 'LDN'},
                        {name: '一般使用者', code: 'IST'}
                    ];

                    this.nodes = [
                        {
                            "label": "測試公司",
                            "data": "Documents Folder",
                            "expandedIcon": "pi pi-folder-open",
                            "collapsedIcon": "pi pi-folder",
                            "children": [{
                                    "label": "管理部門",
                                    "data": "Work Folder",
                                    "expandedIcon": "pi pi-folder-open",
                                    "collapsedIcon": "pi pi-folder",
                                    "children": [{"label": "管理一課", "icon": "pi pi-file", "data": "Expenses Document"}, {"label": "管理二課", "icon": "pi pi-file", "data": "Resume Document"}]
                                },
                                {
                                    "label": "工程部門",
                                    "data": "Home Folder",
                                    "expandedIcon": "pi pi-folder-open",
                                    "collapsedIcon": "pi pi-folder",
                                    "children": [{"label": "工程一部", "icon": "pi pi-file", "data": "Invoices for this month"}]
                                }]
                        },
                        {
                            "label": "Pictures",
                            "data": "Pictures Folder",
                            "expandedIcon": "pi pi-folder-open",
                            "collapsedIcon": "pi pi-folder",
                            "children": [
                                {"label": "barcelona.jpg", "icon": "pi pi-image", "data": "Barcelona Photo"},
                                {"label": "logo.jpg", "icon": "pi pi-file", "data": "PrimeFaces Logo"},
                                {"label": "primeui.png", "icon": "pi pi-image", "data": "PrimeUI Logo"}]
                        },
                        {
                            "label": "Movies",
                            "data": "Movies Folder",
                            "expandedIcon": "pi pi-folder-open",
                            "collapsedIcon": "pi pi-folder",
                            "children": [{
                                    "label": "Al Pacino",
                                    "data": "Pacino Movies",
                                    "children": [{"label": "Scarface", "icon": "pi pi-video", "data": "Scarface Movie"}, {"label": "Serpico", "icon": "pi pi-file-video", "data": "Serpico Movie"}]
                                },
                                {
                                    "label": "Robert De Niro",
                                    "data": "De Niro Movies",
                                    "children": [{"label": "Goodfellas", "icon": "pi pi-video", "data": "Goodfellas Movie"}, {"label": "Untouchables", "icon": "pi pi-video", "data": "Untouchables Movie"}]
                                }]
                        }
                    ];

                }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            {field: 'name', header: 'Name'},
            {field: 'price', header: 'Price'},
            {field: 'category', header: 'Category'},
            {field: 'rating', header: 'Reviews'},
            {field: 'inventoryStatus', header: 'Status'}
        ];

        this.statuses = [
            {label: 'INSTOCK', value: 'instock'},
            {label: 'LOWSTOCK', value: 'lowstock'},
            {label: 'OUTOFSTOCK', value: 'outofstock'}
        ];
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    openNew3() {
        this.router.navigate(['pages/user'], {
            queryParams: { temp: new Date()}, // 如果不想保留 就任一加傳不一樣的參數
            skipLocationChange: true
        });
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = {...product};
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = {...product};
    }

    confirmDeleteSelected(){
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        this.selectedProducts = null;
    }

    confirmDelete(){
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value: this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000});
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}

interface City {
    name: string,
    code: string
}