import express from 'express'
import jwt from 'jsonwebtoken'
import expressjwt from 'express-jwt'
import bodyParser from 'body-parser'
import randtoken from 'rand-token'
import multer from 'multer'
import fs from 'fs'
import util from 'util'
import path from 'path'
import mime from 'mime'
import request from 'request'
import https from 'https'
import ServiceLayer from 'b1-service-layer'
import { Console } from 'console'
//{"CompanyDB": "TEST_ULTRAGENICS", "UserName": "manager"}
let sl = new ServiceLayer()
let config = {
  "host": "https://engel.powerhost.com.mx",
  "port": 50000,
  "version": "v2",
  "username": "manager",
  "password": "Ultr@g3%16",
  "company": "TEST_ULTRAGENICS"
};

(async () => {
  await sl.createSession(config)
})();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
//const AttPath = "\\\\fs\\IJAM_BIN\\BATIJAM\\Send_XML\\Entra_PDF\\"

const app = express()

// const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use((req, res, next) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')
  //res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.3:8080')

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,Cache-Control')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})
//const requestPromise = util.promisify(request)

app.get('/test', (req, res) => {
  res.json({
    ok: true
  })
})

app.get('/testToken', async (req, res) => {
  let token = await getToken()
  let parsedBody = JSON.parse(token)
  res.json({
    body: parsedBody.access_token
  })
})
function getSerieBP(tipo) {
  /*
012D6000004KcJRIA0/76 PacienteC
012D6000004KcIEIA0/77 MedicoC
012D6000004KcK0IAK/78 DistribuidorC
*/
  let serie
  switch (tipo) {
    case "012D6000004KcJRIA0":
      serie = 76
      break;
    case "012D6000004KcIEIA0":
      serie = 77
      break;
    case "012D6000004KcK0IAK":
      serie = 78
      break;
    default:
      serie = 76
      break;
  }
  return serie;
}
function getLPBP(tipo) {
  /*
012D6000004KcJRIA0/76 PacienteC
012D6000004KcIEIA0/77 MedicoC
012D6000004KcK0IAK/78 DistribuidorC
//dist 2
// med 3
//pub 4
*/
  let lp
  switch (tipo) {
    case "012D6000004KcJRIA0":
      lp = 4
      break;
    case "012D6000004KcIEIA0":
      lp = 3
      break;
    case "012D6000004KcK0IAK":
      lp = 2
      break;
    default:
      lp = 4
      break;
  }
  return lp;
}
function getWhsCode(serie) {
  let WhsCode
  switch (serie) {
    case 9:
      WhsCode = "01"
      break;
    case 87:
      WhsCode = "05"
      break;
    case 158:
      WhsCode = "15"
      break;
    case 86:
      WhsCode = "03"
      break;
    case 135:
      WhsCode = "10"
      break;
    default:
      WhsCode = "01"
      break;
  }
  return WhsCode;
}
app.post('/Pedido', async (req, res) => {
  try {
    let token = await getToken()
    let parsedToken = JSON.parse(token)
    var req2 = {
      //uri: "https://energy-flow-2342--ultradev.sandbox.my.salesforce.com/services/data/v58.0/query/?q= SELECT Id, Numero_de_pedido_SN__c, OrderNumber, AccountId, EffectiveDate, Status,Mensajaria__c, Fecha_de_entrega__c, Fecha_de_pago__c,EndDate, Descuento__c, Total_del_pedido__c, CurrencyIsoCode, Codigo_de_socio__c, BillingCountry, BillingStreet,BillingPostalCode, BillingCity, BillingState, ShippingCountry, ShippingStreet, ShippingPostalCode, ShippingCity, ShippingState, Pricebook2Id, Pedido_tipo_factura__c, Description, Codigo_SN__c, Vendedor__c, RecordTypeId, (SELECT Id, Quantity, UnitPrice, AvailableQuantity, Description, Descuento__c, EndDate, ServiceDate, IVA__c, Monto_de_convenio__c, OrderItemNumber, OrderId, ListPrice, TotalPrice, Product2Id, Product2.Name,Product2.ProductCode FROM OrderItems) FROM Order WHERE Id= '"+req.body.records[0].Id+"'",
      //uri: "https://energy-flow-2342--ultradev.sandbox.my.salesforce.com/services/data/v58.0/query/?q= SELECT Id, Numero_de_pedido_SN__c, OrderNumber, AccountId, EffectiveDate, Status,Mensajaria__c, Fecha_de_entrega__c, Fecha_de_pago__c,EndDate, Descuento__c, Total_del_pedido__c, CurrencyIsoCode, Codigo_de_socio__c, BillingCountry, BillingStreet,BillingPostalCode, BillingCity, BillingState, ShippingCountry, ShippingStreet, ShippingPostalCode, ShippingCity, ShippingState, Pricebook2Id, Pedido_tipo_factura__c, Description, Codigo_SN__c, Vendedor__c, Vendedor_Comision__c, Vendedor_Comision__r.Name, Vendedor_Comision__r.P_blico_descuento_INSEN_INAPAM__c,Vendedor_Comision__r.Codigo_vendedor_SAP__c,Vendedor_Comision__r.Codigo_empleado_SAP__c,Vendedor_Comision__r.Usuario__c,Vendedor_Comision__r.Tipo_de_comisionista__c,Vendedor_Comision__r.Cliente__c,Vendedor_Comision__r.Publico_l_der__c,Vendedor_Comision__r.P_blico_lento_movimiento__c,Vendedor_Comision__r.P_blico_descuento_regular__c,Vendedor_Comision__r.P_blico_de_l_nea__c,Vendedor_Comision__r.P_blico_descuento_remate__c,Vendedor_Comision__r.M_dico_l_der__c,Vendedor_Comision__r.M_dico_lento_movimiento__c,Vendedor_Comision__r.M_dico_descuento_regular__c,Vendedor_Comision__r.M_dico_de_l_nea__c,Vendedor_Comision__r.M_dico_descuento_remate__c,Vendedor_Comision__r.Distribuidor_l_der__c,Vendedor_Comision__r.Distribuidor_lento_movimiento__c,Vendedor_Comision__r.Distribuidor_descuento_regular__c,Vendedor_Comision__r.Distribuidor_de_l_nea__c,Vendedor_Comision__r.Distribuidor_descuento_remate__c, Codigo_vendedor_SAP__c, Propietario__c, Codigo_empleado_SAP__c,  Propietario__r.Name, Propietario__r.P_blico_descuento_INSEN_INAPAM__c,Propietario__r.Codigo_vendedor_SAP__c,Propietario__r.Codigo_empleado_SAP__c,Propietario__r.Usuario__c,Propietario__r.Tipo_de_comisionista__c,Propietario__r.Cliente__c,Propietario__r.Publico_l_der__c,Propietario__r.P_blico_lento_movimiento__c,Propietario__r.P_blico_descuento_regular__c,Propietario__r.P_blico_de_l_nea__c,Propietario__r.P_blico_descuento_remate__c,Propietario__r.M_dico_l_der__c,Propietario__r.M_dico_lento_movimiento__c,Propietario__r.M_dico_descuento_regular__c,Propietario__r.M_dico_de_l_nea__c,Propietario__r.M_dico_descuento_remate__c,Propietario__r.Distribuidor_l_der__c,Propietario__r.Distribuidor_lento_movimiento__c,Propietario__r.Distribuidor_descuento_regular__c,Propietario__r.Distribuidor_de_l_nea__c,Propietario__r.Distribuidor_descuento_remate__c, RecordTypeId,Serie__c, (SELECT Id, Quantity, UnitPrice, AvailableQuantity, Description, Descuento__c, EndDate, ServiceDate, IVA__c, Monto_de_convenio__c, OrderItemNumber, OrderId, ListPrice, TotalPrice, Product2Id, Product2.Name, Product2.ProductCode FROM OrderItems) FROM Order WHERE Id='" + req.body.records[0].Id + "'",
      uri: "https://energy-flow-2342--ultradev.sandbox.my.salesforce.com/services/data/v58.0/query/?q= SELECT Id, EffectiveDate, Fecha_de_entrega__c, Fecha_de_documento__c, Numero_de_pedido_SN__c,RFC__c,Referencia_de_portal__c, Description, Razon_social__c, Regimen_fiscal__c, Uso_de_CFDI__c, Account.Canal__r.Name, Almacen__c,OrderNumber, AccountId, Serie__c, Status,Mensajaria__c, Fecha_de_pago__c,EndDate, Descuento__c, Total_del_pedido__c, CurrencyIsoCode, Codigo_de_socio__c, BillingCountry, BillingStreet,BillingPostalCode, BillingCity, BillingState, ShippingCountry, ShippingStreet, ShippingPostalCode, ShippingCity, ShippingState, Pricebook2Id, Pedido_tipo_factura__c, Codigo_SN__c, Vendedor__c, Vendedor_Comision__c, Vendedor_Comision__r.Name, Vendedor_Comision__r.P_blico_descuento_INSEN_INAPAM__c,Vendedor_Comision__r.Codigo_vendedor_SAP__c,Vendedor_Comision__r.Codigo_empleado_SAP__c,Vendedor_Comision__r.Usuario__c,Vendedor_Comision__r.Tipo_de_comisionista__c,Vendedor_Comision__r.Cliente__c,Vendedor_Comision__r.Publico_l_der__c,Vendedor_Comision__r.P_blico_lento_movimiento__c,Vendedor_Comision__r.P_blico_descuento_regular__c,Vendedor_Comision__r.P_blico_de_l_nea__c,Vendedor_Comision__r.P_blico_descuento_remate__c,Vendedor_Comision__r.M_dico_l_der__c,Vendedor_Comision__r.M_dico_lento_movimiento__c,Vendedor_Comision__r.M_dico_descuento_regular__c,Vendedor_Comision__r.M_dico_de_l_nea__c,Vendedor_Comision__r.M_dico_descuento_remate__c,Vendedor_Comision__r.Distribuidor_l_der__c,Vendedor_Comision__r.Distribuidor_lento_movimiento__c,Vendedor_Comision__r.Distribuidor_descuento_regular__c,Vendedor_Comision__r.Distribuidor_de_l_nea__c,Vendedor_Comision__r.Distribuidor_descuento_remate__c, Codigo_vendedor_SAP__c, Propietario__c, Codigo_empleado_SAP__c,  Propietario__r.Name, Propietario__r.P_blico_descuento_INSEN_INAPAM__c,Propietario__r.Codigo_vendedor_SAP__c,Propietario__r.Codigo_empleado_SAP__c,Propietario__r.Usuario__c,Propietario__r.Tipo_de_comisionista__c,Propietario__r.Cliente__c,Propietario__r.Publico_l_der__c,Propietario__r.P_blico_lento_movimiento__c,Propietario__r.P_blico_descuento_regular__c,Propietario__r.P_blico_de_l_nea__c,Propietario__r.P_blico_descuento_remate__c,Propietario__r.M_dico_l_der__c,Propietario__r.M_dico_lento_movimiento__c,Propietario__r.M_dico_descuento_regular__c,Propietario__r.M_dico_de_l_nea__c,Propietario__r.M_dico_descuento_remate__c,Propietario__r.Distribuidor_l_der__c,Propietario__r.Distribuidor_lento_movimiento__c,Propietario__r.Distribuidor_descuento_regular__c,Propietario__r.Distribuidor_de_l_nea__c,Propietario__r.Distribuidor_descuento_remate__c, RecordTypeId, Direccion_de_destino__r.Name, Direccion_de_facturacion__r.Name,(SELECT Id, Quantity, UnitPrice, AvailableQuantity, Description, Descuento__c, EndDate, ServiceDate, IVA__c, Monto_de_convenio_txt__c, OrderItemNumber, OrderId, ListPrice, TotalPrice, Product2Id, Product2.Name, Product2.ProductCode, Usuario_de_venta__c,Usuario_de_venta__r.Codigo_vendedor_SAP__c, Usuario_de_venta__r.Codigo_empleado_SAP__c FROM OrderItems) FROM Order WHERE Id= '" + req.body.records[0].Id + "'",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + parsedToken.access_token,
        "Content-Type": "application/json"
      }
    }
    let pedido = await requestSalesForce(req2)
    let parsedPedido = JSON.parse(pedido)
    //console.log(parsedPedido.records[0]);
    //console.log(parsedPedido.records[0].Vendedor_Comision__r);
    //console.log(parsedPedido.records[0].Vendedor_Comision__r.Codigo_vendedor_SAP__c);
    //console.log(parsedPedido.records[0].Vendedor_Comision__r.Codigo_empleado_SAP__c);
    console.log(parsedPedido.records[0].Vendedor_Comision__r.Codigo_vendedor_SAP__c);
    console.log(parsedPedido.records[0].Propietario__r.Codigo_empleado_SAP__c);
    let DocumentLines = []
    parsedPedido.records[0].OrderItems.records.forEach(function (valor, indice, array) {
      //console.log(valor);
      DocumentLines.push({
        "ItemCode": valor.Product2.ProductCode,
        "Quantity": valor.Quantity,
        "UnitPrice": valor.UnitPrice,
        "DiscountPercent": valor.Descuento__c,
        "U_CEU_MCONV": parseFloat(valor.Monto_de_convenio_txt__c),
        "WarehouseCode": parsedPedido.records[0].Almacen__c,
        "SalesPersonCode": parseInt(valor.Usuario_de_venta__r.Codigo_vendedor_SAP__c)
      })
    })
    
    let Order = await sl.post(`Orders`, {
      "Series": parsedPedido.records[0].Serie__c,
      "CardCode": parsedPedido.records[0].Codigo_SN__c,
      "DocDate": parsedPedido.records[0].EffectiveDate,
      "DocDueDate": parsedPedido.records[0].Fecha_de_entrega__c,
      "TaxDate": parsedPedido.records[0].Fecha_de_documento__c,
      "DocumentLines": DocumentLines,
      "SalesPersonCode": parsedPedido.records[0].Vendedor_Comision__r != undefined ? (parsedPedido.records[0].Vendedor_Comision__r.Codigo_vendedor_SAP__c != null ? parsedPedido.records[0].Vendedor_Comision__r.Codigo_vendedor_SAP__c : "") : "",
      "DocumentsOwner": parsedPedido.records[0].Propietario__r != undefined ? (parsedPedido.records[0].Propietario__r.Codigo_empleado_SAP__c != null ? parsedPedido.records[0].Propietario__r.Codigo_empleado_SAP__c : "") : "",
      "U_SalesForceID": req.body.records[0].Id != null ? req.body.records[0].Id : "",
      "U_Modelo":  parsedPedido.records[0].Razon_social__c != null ? parsedPedido.records[0].Razon_social__c : "",
      "U_B1SYS_MainUsage": parsedPedido.records[0].Uso_de_CFDI__c != null ? parsedPedido.records[0].Uso_de_CFDI__c : "",
      "U_MARCA": parsedPedido.records[0].Regimen_fiscal__c != null ? parsedPedido.records[0].Regimen_fiscal__c : "",
      "FederalTaxID": parsedPedido.records[0].RFC__c != null ? parsedPedido.records[0].RFC__c : "",
      "Comments": parsedPedido.records[0].Description != null ? parsedPedido.records[0].Description : "",
      "ShipToCode": parsedPedido.records[0].Direccion_de_destino__r.Name != null ? parsedPedido.records[0].Direccion_de_destino__r.Name : "",
      "PayToCode": parsedPedido.records[0].Direccion_de_facturacion__r.Name != null ? parsedPedido.records[0].Direccion_de_facturacion__r.Name : "",
      "NumAtCard": parsedPedido.records[0].Referencia_de_portal__c != null ? parsedPedido.records[0].Referencia_de_portal__c : ""
    })
    //console.log(parsedPedido)
    res.json({
      success: true,
      //parsedPedido,
      data: Order
    })
  } catch (e) {
    console.log("Error Occurred", e)
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }

})
app.get('/pedidoSF', async (req, res) => {
  try {
    let token = await getToken()
    let parsedBody = JSON.parse(token)
    //console.log(`"Bearer ${parsedBody.access_token}"`)
    var req2 = {
      uri: "https://energy-flow-2342--ultradev.sandbox.my.salesforce.com/services/data/v58.0/sobjects/Account/id/001D600001nAjicIAC",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + parsedBody.access_token,
        "Content-Type": "application/json"
      }
    }
    let pedido = await requestSalesForce(req2)
    let parsedPedido = JSON.parse(pedido)
    res.json({
      parsedPedido
    })
  } catch (e) {
    console.log("Error Occurred", e)
  }
})
/*PRODUCTIVOS*/
app.get('/Articulos/:codigo', (req, res) => {
  try {
    (async () => {
      let articulo_codigo = req.params.codigo
      let Items = await sl.get(`Items('${articulo_codigo}')?$select=ItemCode,ItemName,U_TAXCODE,Frozen,ItemPrices`)
      res.json({
        success: true,
        data: Items
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/Clientes', (req, res) => {
  try {
    let top = req.query.top
    let skip = req.query.skip
    let fecha = req.query.fecha
    let clientes
    (async () => {
      if (top != undefined && skip != undefined && fecha != undefined) {
        clientes = await sl.get(`BusinessPartners?$filter=UpdateDate eq '${fecha}'&$top=${top}&$skip=${skip}`)
        res.json({
          success: true,
          data: clientes
        })
      } else {
        res.json({
          success: false,
          data: "Debe proporcionar los valores top y skip en la url. Ej. /Clientes?top=100&skip=100&fecha=año-mes-dia"
        })
      }
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/Facturas', (req, res) => {
  try {
    let top = req.query.top
    let skip = req.query.skip
    let fecha = req.query.fecha
    let Facturas
    (async () => {
      if (top != undefined && skip != undefined && fecha != undefined) {
        //https://engel.powerhost.com.mx:50000/b1s/v1/$crossjoin(Invoices,BusinessPartners,Invoices/DocumentLines)?$expand=Invoices($select=Series,DocEntry,DocNum,U_SalesForceID,CardCode,CardName,DocDate,DocDueDate,SalesPersonCode,DocumentsOwner,DocTotal,VatSum,PaidToDate),BusinessPartners($select=U_SalesForceID),Invoices/DocumentLines($select=ItemCode,Quantity,WarehouseCode,UnitPrice,PriceAfterVAT,TaxCode,TaxPercentagePerRow)&$filter=Invoices/CardCode eq BusinessPartners/CardCode and Invoices/Cancelled eq 'N' and BusinessPartners/Properties4 eq 'Y' and Invoices/DocumentLines/DocEntry eq Invoices/DocEntry and Invoices/DocDate eq '2024-06-29'
        Facturas = await sl.get(`$crossjoin(Invoices,BusinessPartners,Invoices/DocumentLines,Invoices/TaxExtension,PaymentTermsTypes)?$expand=Invoices($select=Series,DocEntry,DocObjectCode,DocNum,U_SalesForceID,CardCode,CardName,DocDate,TaxDate,DocDueDate,UpdateDate,SalesPersonCode,DocumentsOwner,DocTotal,VatSum,PaidToDate,Cancelled,Comments,U_Plan2,FederalTaxID,U_B1SYS_MainUsage,U_MARCA,U_Modelo,NumAtCard,SalesPersonCode,PayToCode,ShipToCode),BusinessPartners($select=U_SalesForceID,U_NACIONALIDAD as ReferidoDe,ChannelBP as ReferidoPor),Invoices/DocumentLines($select=ItemCode,ItemDescription,Quantity,WarehouseCode,UnitPrice,PriceAfterVAT,TaxCode,TaxPercentagePerRow,DiscountPercent,U_CEU_MCONV,SalesPersonCode,ListNum),Invoices/TaxExtension($select=ZipCodeB),PaymentTermsTypes($select=GroupNumber,PaymentTermsGroupName,PriceListNo)&$filter=Invoices/CardCode eq BusinessPartners/CardCode and Invoices/Cancelled ne 'C' and BusinessPartners/Properties4 eq 'Y' and Invoices/DocumentLines/DocEntry eq Invoices/DocEntry and Invoices/TaxExtension/DocEntry eq Invoices/DocEntry and PaymentTermsTypes/GroupNumber eq Invoices/PaymentGroupCode and Invoices/UpdateDate eq '${fecha}'&$top=${top}&$skip=${skip}`)
        res.json({
          success: true,
          data: Facturas
        })
      } else {
        res.json({
          success: false,
          data: "Debe proporcionar los valores top y skip en la url. Ej. /Facturas?top=100&skip=100&fecha=año-mes-dia"
        })
        //Items = await sl.get(`Items?$select=ItemCode,ItemName,U_TAXCODE,Frozen,ItemPrices`)
      }
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.patch('/Facturas/:codigo', (req, res) => {
  try {
    (async () => {
      let parsedBody = req.body
      let factura_codigo = req.params.codigo
      let Invoice = await sl.patch(`Invoices(${factura_codigo})`, {
        "U_SalesForceID": parsedBody.Id
      })
      res.json({
        success: true,
        data: Invoice
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/NotasCredito', (req, res) => {
  try {
    let top = req.query.top
    let skip = req.query.skip
    let fecha = req.query.fecha
    let NotasCredito
    (async () => {
      if (top != undefined && skip != undefined && fecha != undefined) {
        //https://engel.powerhost.com.mx:50000/b1s/v1/$crossjoin(CreditNotes,BusinessPartners,CreditNotes/DocumentLines)?$expand=CreditNotes($select=Series,DocEntry,DocNum,U_SalesForceID,CardCode,CardName,DocDate,DocDueDate,SalesPersonCode,DocumentsOwner,DocTotal,VatSum,PaidToDate),BusinessPartners($select=U_SalesForceID),CreditNotes/DocumentLines($select=ItemCode,Quantity,WarehouseCode,UnitPrice,PriceAfterVAT,TaxCode,TaxPercentagePerRow,BaseEntry,BaseType)&$filter=CreditNotes/CardCode eq BusinessPartners/CardCode and CreditNotes/Cancelled eq 'N' and BusinessPartners/Properties4 eq 'Y' and CreditNotes/DocumentLines/DocEntry eq CreditNotes/DocEntry CreditNotes/DocDate eq '2024-06-29'
        NotasCredito = await sl.get(`$crossjoin(CreditNotes,BusinessPartners,CreditNotes/DocumentLines,CreditNotes/TaxExtension,PaymentTermsTypes)?$expand=CreditNotes($select=Series,DocEntry,DocObjectCode,DocNum,U_SalesForceID,CardCode,CardName,DocDate,TaxDate,DocDueDate,UpdateDate,SalesPersonCode,DocumentsOwner,DocTotal,VatSum,PaidToDate,Cancelled,Comments,U_Plan2,FederalTaxID,U_B1SYS_MainUsage,U_MARCA,U_Modelo,NumAtCard,PayToCode,ShipToCode),BusinessPartners($select=U_SalesForceID,U_NACIONALIDAD as ReferidoDe,ChannelBP as ReferidoPor),CreditNotes/DocumentLines($select=ItemCode,ItemDescription,Quantity,WarehouseCode,UnitPrice,PriceAfterVAT,TaxCode,TaxPercentagePerRow,DiscountPercent,BaseEntry,BaseType,U_CEU_MCONV,SalesPersonCode,ListNum),CreditNotes/TaxExtension($select=ZipCodeB),PaymentTermsTypes($select=GroupNumber,PaymentTermsGroupName,PriceListNo)&$filter=CreditNotes/CardCode eq BusinessPartners/CardCode and CreditNotes/Cancelled ne 'C' and BusinessPartners/Properties4 eq 'Y' and CreditNotes/DocumentLines/DocEntry eq CreditNotes/DocEntry and CreditNotes/TaxExtension/DocEntry eq CreditNotes/DocEntry and PaymentTermsTypes/GroupNumber eq CreditNotes/PaymentGroupCode and CreditNotes/UpdateDate eq '${fecha}'&$top=${top}&$skip=${skip}`)
        res.json({
          success: true,
          data: NotasCredito
        })
      } else {
        res.json({
          success: false,
          data: "Debe proporcionar los valores top y skip en la url. Ej. /NotasCredito?top=100&skip=100&fecha=año-mes-dia"
        })
      }
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.patch('/NotasCredito/:codigo', (req, res) => {
  try {
    (async () => {
      let parsedBody = req.body
      let notacredito_codigo = req.params.codigo
      let NotasCredito = await sl.patch(`CreditNotes(${notacredito_codigo})`, {
        "U_SalesForceID": parsedBody.Id
      })
      res.json({
        success: true,
        data: NotasCredito
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.post('/Direccion', (req, res) => {
  try {
    (async () => {
      let parsedBody = req.body
      let BPData = await sl.get(`BusinessPartners?$filter=U_SalesForceID eq '${parsedBody.Cuenta__c}'`)
      let existe = false
      if (BPData.value.length > 0) {
        BPData.value[0].BPAddresses.forEach(function (valor, indice, array) {
          if (valor.U_SalesForceID == parsedBody.Id || valor.AddressName == parsedBody.Name) {
            BPData.value[0].BPAddresses[indice].AddressName = parsedBody.Name,
              BPData.value[0].BPAddresses[indice].Street = parsedBody.Calle__c,
              //BPData.value.BPAddresses[indice].AddressType = "bo_BillTo",
              BPData.value[0].BPAddresses[indice].City = parsedBody.Ciudad__c,
              BPData.value[0].BPAddresses[indice].State = parsedBody.Estado_Picklist__c,//"SIN",//parsedBody.Estado__c, 
              BPData.value[0].BPAddresses[indice].ZipCode = parsedBody.Codigo_postal__c,
              BPData.value[0].BPAddresses[indice].Block = parsedBody.Colonia__c,
              BPData.value[0].BPAddresses[indice].Country = "MX",
              BPData.value[0].BPAddresses[indice].County = parsedBody.Delegacion_o_Municipio__c,
              BPData.value[0].BPAddresses[indice].U_CEU_ENCA = parsedBody.Entre_Calles__c,
              BPData.value[0].BPAddresses[indice].U_CEU_OBDI = parsedBody.Observaciones__c,
              //BPData.value[0].BPAddresses[indice].U_RUTA = parsedBody.Ruta__c,
              BPData.value[0].BPAddresses[indice].U_SalesForceID = parsedBody.Id
            existe = true
            return
          }
        })
        if (existe == false) {
          BPData.value[0].BPAddresses.push({
            "AddressName": parsedBody.Name,
            "Street": parsedBody.Calle__c,
            "AddressType": parsedBody.Tipo_de_direccion__c,//"bo_BillTo",
            "City": parsedBody.Ciudad__c,
            "State": parsedBody.Estado_Picklist__c,//"SIN",///parsedBody.Estado__c, 
            "ZipCode": parsedBody.Codigo_postal__c,
            "Block": parsedBody.Colonia__c,
            "Country": "MX",
            "County": parsedBody.Delegacion_o_Municipio__c,
            "U_CEU_ENCA": parsedBody.Entre_Calles__c,
            "U_CEU_OBDI": parsedBody.Observaciones__c,
            "U_SalesForceID": parsedBody.Id
          })
        }
        let BP = await sl.patch(`BusinessPartners('${BPData.value[0].CardCode}')'`, {
          "BPAddresses": BPData.value[0].BPAddresses
        })
        res.json({
          success: true,
          message: "Dirección registrada/actualizada con exito en SAP.",
          data: BP
        })
      } else {
        res.json({
          success: false,
          data: "El cliente no se encuentra registrado en SAP."
        })
      }
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.post('/Contacto', (req, res) => {
  try {
    (async () => {
      let parsedBody = req.body
      let BPData = await sl.get(`BusinessPartners?$filter=U_SalesForceID eq '${parsedBody.Cuenta__c}'`)
      let existe = false
      if (BPData.value.length > 0) {
        BPData.value[0].ContactEmployees.forEach(function (valor, indice, array) {
          //console.log(parsedBody.Id)
          //console.log(valor.U_SalesForceID)
          //console.log(parsedBody.Especialidades__c);
          if (valor.U_SalesForceID == parsedBody.Id || valor.Name == parsedBody.Name) {
              BPData.value[0].ContactEmployees[indice].Name = parsedBody.Name != null ? parsedBody.Name:"",
              BPData.value[0].ContactEmployees[indice].Phone1 = parsedBody.Phone != null ? parsedBody.Phone:"",
              BPData.value[0].ContactEmployees[indice].MobilePhone = parsedBody.MobilePhone != null ? parsedBody.MobilePhone:"",
              BPData.value[0].ContactEmployees[indice].E_Mail = parsedBody.Email != null ? parsedBody.Email:"",
              BPData.value[0].ContactEmployees[indice].Title = parsedBody.Salutation != null ? parsedBody.Salutation:"",
              BPData.value[0].ContactEmployees[indice].FirstName = parsedBody.FirstName != null ? parsedBody.FirstName:"",
              BPData.value[0].ContactEmployees[indice].MiddleName = parsedBody.MiddleName != null ? parsedBody.MiddleName:"",
              BPData.value[0].ContactEmployees[indice].LastName = parsedBody.LastName != null ? parsedBody.LastName:"",
              BPData.value[0].ContactEmployees[indice].U_SalesForceID = parsedBody.Id != null ? parsedBody.Id:"",
              BPData.value[0].ContactEmployees[indice].Profession = parsedBody.Profesion__c != null ? parsedBody.Profesion__c:"",
              BPData.value[0].ContactEmployees[indice].Position = parsedBody.Especialidades__c != null ? parsedBody.Especialidades__c:"",
              BPData.value[0].ContactEmployees[indice].DateOfBirth = parsedBody.Fecha_de_nacimiento__c != null ? parsedBody.Fecha_de_nacimiento__c : "",
              BPData.value[0].ContactEmployees[indice].Gender = parsedBody.Sexo__c == "Masculino" ? "gt_Male" : "gt_Female",
              BPData.value[0].ContactEmployees[indice].Address = parsedBody.MailingStreet + " " + parsedBody.MailingCity + " " + parsedBody.MailingState + " " + parsedBody.MailingCountry + " " +  parsedBody.MailingPostalCode
            existe = true
            return
          }
        })
        //console.log(existe)
        if (existe == false) {
          BPData.value[0].ContactEmployees.push({
            "Name": parsedBody.Name,
            "Phone1": parsedBody.Phone1,
            "MobilePhone": parsedBody.MobilePhone,
            "E_Mail": parsedBody.Email,
            "Title": parsedBody.Salutation,
            "FirstName": parsedBody.FirstName,
            "MiddleName": parsedBody.MiddleName,
            "LastName": parsedBody.LastName,
            "U_SalesForceID": parsedBody.Id,
            "Profession": parsedBody.Profesion__c,
            "Position": parsedBody.Especialidades__c,
            "DateOfBirth": parsedBody.Fecha_de_nacimiento__c,
            "Gender": parsedBody.Sexo__c == "Masculino" ? "gt_Male" : "gt_Female",
            "Address": parsedBody.MailingStreet + " " + parsedBody.MailingCity + " " + parsedBody.MailingState + " " + parsedBody.MailingCountry + " " +  parsedBody.MailingPostalCode
          })
        }
        let BP = await sl.patch(`BusinessPartners('${BPData.value[0].CardCode}')'`, {
          "ContactEmployees": BPData.value[0].ContactEmployees
        })
        res.json({
          success: true,
          message: "Contacto registrado/actualizado con exito en SAP.",
          data: BP
        })
      } else {
        res.json({
          success: false,
          data: "El cliente no se encuentra registrado en SAP."
        })
      }
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/Articulos', (req, res) => {
  try {
    let top = req.query.top
    let skip = req.query.skip
    let Items
    (async () => {
      if (top != undefined && skip != undefined) {
        Items = await sl.get(`Items?$select=ItemCode,ItemName,U_TAXCODE,Frozen,ItemPrices,Properties64&$filter=Properties64 eq 'tYES'&$top=${top}&$skip=${skip}`)
        res.json({
          success: true,
          data: Items
        })
      } else {
        res.json({
          success: false,
          data: "Debe proporcionar los valores top y skip en la url. Ej. /Articulos?top=100&skip=100"
        })
      }
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/ListaPrecios', (req, res) => {
  try {
    (async () => {
      let PriceLists = await sl.get(`PriceLists?$filter=Active eq 'tYES'`)
      res.json({
        success: true,
        data: PriceLists
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/PreciosEspeciales', (req, res) => {
  try {
    let top = req.query.top
    let skip = req.query.skip
    let PriceLists
    (async () => {
      /*let PriceLists = await sl.get(`SpecialPrices?$filter=Valid eq 'tYES'`)
          res.json({
            success: true,
            data: PriceLists
          })*/
      if (top != undefined && skip != undefined) {
        PriceLists = await sl.get(`SpecialPrices?$filter=Valid eq 'tYES'&$top=${top}&$skip=${skip}`)
        res.json({
          success: true,
          data: PriceLists
        })
      } else {
        res.json({
          success: false,
          data: "Debe proporcionar los valores top y skip en la url. Ej. /PreciosEspeciales?top=100&skip=100"
        })
        //Items = await sl.get(`Items?$select=ItemCode,ItemName,U_TAXCODE,Frozen,ItemPrices`)
      }
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/Conciliaciones', (req, res) => {
  try {
    let top = req.query.top
    let skip = req.query.skip
    let fecha = req.query.fecha
    let Conciliaciones
    (async () => {
      if (top != undefined && skip != undefined && fecha != undefined) {
        Conciliaciones = await sl.get(`view.svc/ReconciliacionFacturasB1SLQuery?$filter=Fechapago eq '${fecha}'&$top=${top}&$skip=${skip}`)
        res.json({
          success: true,
          data: Conciliaciones
        })
      } else {
        res.json({
          success: false,
          data: "Debe proporcionar los valores top y skip en la url. Ej. /Conciliaciones?fecha=año-mes-día&top=100&skip=0"
        })
      }
    })();
  }catch (error) {
  console.error('Error processing request:', error);
  res.status(500).json({
    success: false,
    message: 'An error occurred while processing your request.'
  });
}
})
https://engel.powerhost.com.mx:50000/b1s/v1/view.svc/ReconciliacionFacturasB1SLQuery?$filter=DocDate eq '2013-11-29'
app.get('/Inventario', (req, res) => {
  try {
    let top = req.query.top
    let skip = req.query.skip
    let fecha = req.query.fecha
    let Inventory
    (async () => {
      if (top != undefined && skip != undefined && fecha != undefined) {
        Inventory = await sl.get(`SQLQueries('Inventario')/List?&fecha='${fecha}'&$top=${top}&$skip=${skip}`)
        res.json({
          success: true,
          data: Inventory
        })
      } else {
        res.json({
          success: false,
          data: "Debe proporcionar los valores top y skip en la url. Ej. /Inventario?fecha=año-mes-día&top=100&skip=0"
        })
      }
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/ListaPrecios/:codigo', (req, res) => {
  try {
    (async () => {
      let lista_codigo = req.params.codigo
      let PriceLists = await sl.get(`PriceLists(${lista_codigo})`)
      res.json({
        success: true,
        data: PriceLists
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.post('/Cliente', (req, res) => {
  try {
    (async () => {
      let parsedBody = req.body
      //console.log(parsedBody)
      //        let parsedBody = JSON.parse(req.body);
      let BP = await sl.post(`BusinessPartners`, {
        "Series": getSerieBP(parsedBody.RecordTypeId),
        "CardName": parsedBody.LastName + " " + parsedBody.FirstName,//parsedBody.Name,
        "CardType": "C",
        "FederalTaxID": parsedBody.RFC__c,
        "U_NACIONALIDAD": parsedBody.CardCode_Cliente_referido_de__c != null ? parsedBody.CardCode_Cliente_referido_de__c : "",
        "ChannelBP": parsedBody.CardCode_Canal__c != null ? parsedBody.CardCode_Canal__c : "",
        "U_SalesForceID": parsedBody.Id,
        "U_CEU_CPORTAL": parsedBody.Email__c,
        "PriceListNum": parsedBody.Lista_de_precios__c != null ? parsedBody.Lista_de_precios__c : "",//getLPBP(parsedBody.RecordTypeId),//Buscar por tipo de registro
        "U_B1SYS_MainUsage": parsedBody.Uso_de_CFDI__c != null ? parsedBody.Uso_de_CFDI__c : "G03",
        "U_B1SYS_FiscRegime": parsedBody.Regimenl_fiscal__c != null ? parsedBody.Regimenl_fiscal__c : "601",
        "Cellular": parsedBody.Phone != null ? parsedBody.Phone: "",
        "CreditLimit": parsedBody.Limite_de_credito__c != null ? parsedBody.Limite_de_credito__c : "",
        "ValidRemarks": parsedBody.Description != null ? parsedBody.Description : "",
        "Properties4": 'Y',
        "U_XAMDATA": parsedBody.Fecha_de_nacimiento__c != null ? parsedBody.Fecha_de_nacimiento__c : "",
        "U_TIPO": parsedBody.Sexo__c != null ? parsedBody.Sexo__c : "",
        "SalesPersonCode": parsedBody.Codigo_de_vendedor_SAP__c != null ? parsedBody.Codigo_de_vendedor_SAP__c : -1,
        "U_Alias": parsedBody.Razon_social__c != null ? parsedBody.Razon_social__c : "",
        "PayTermsGrpCode": parsedBody.Condicion_de_pago__c != null ? parsedBody.Condicion_de_pago__c : ""
        // "Limite_de_credito__c": parsedBody.Limite_de_credito__c
      })
      //console.log(orders)
      res.json({
        success: true,
        data: BP
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/Cliente/:codigo', (req, res) => {
  try {
    (async () => {
      let cliente_codigo = req.params.codigo
      let cliente = await sl.get(`BusinessPartners('${cliente_codigo}')`)
      res.json({
        success: true,
        data: cliente
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.patch('/Cliente/:codigo', (req, res) => {
  try {
    (async () => {
      let parsedBody = req.body
      let cliente_codigo = req.params.codigo
      //        let parsedBody = JSON.parse(req.body);
      //console.log(parsedBody.Lista_de_precios__c);
      let BP = await sl.patch(`BusinessPartners('${cliente_codigo}')`, {
        //"Series": 76,
        "CardName": parsedBody.LastName + " " + parsedBody.FirstName,
        //"CardType": "C",
        "FederalTaxID": parsedBody.RFC__c,
        //"ChannelBP": parsedBody.CardCode_Cliente_referido_de__c != null ? parsedBody.CardCode_Cliente_referido_de__c : "",
        "U_NACIONALIDAD": parsedBody.CardCode_Cliente_referido_de__c != null ? parsedBody.CardCode_Cliente_referido_de__c : "",
        "ChannelBP": parsedBody.CardCode_Canal__c != null ? parsedBody.CardCode_Canal__c : "",
        "U_SalesForceID": parsedBody.Id,
        //"ListNum": 3,
        "U_CEU_CPORTAL": parsedBody.Email__c,
        //"Currency": "MXP",
        "PriceListNum": parsedBody.Lista_de_precios__c != null ? parsedBody.Lista_de_precios__c : "",//getLPBP(parsedBody.RecordTypeId),//Buscar por tipo de registro
        "U_B1SYS_MainUsage": parsedBody.Uso_de_CFDI__c != null ? parsedBody.Uso_de_CFDI__c : "G03",
        "U_B1SYS_FiscRegime": parsedBody.Regimenl_fiscal__c != null ? parsedBody.Regimenl_fiscal__c : "601",
        "Cellular": parsedBody.Phone != null ? parsedBody.Phone: "",
        "CreditLimit": parsedBody.Limite_de_credito__c != null ? parsedBody.Limite_de_credito__c : "",
        "ValidRemarks": parsedBody.Description != null ? parsedBody.Description : "",
        "U_XAMDATA": parsedBody.Fecha_de_nacimiento__c != null ? parsedBody.Fecha_de_nacimiento__c : "",
        "U_TIPO": parsedBody.Sexo__c != null ? parsedBody.Sexo__c : "",
        "SalesPersonCode": parsedBody.Codigo_de_vendedor_SAP__c != null ? parsedBody.Codigo_de_vendedor_SAP__c : -1,
        "U_Alias": parsedBody.Razon_social__c != null ? parsedBody.Razon_social__c : "",
        "PayTermsGrpCode": parsedBody.Condicion_de_pago__c != null ? parsedBody.Condicion_de_pago__c : ""
      })
      res.json({
        success: true,
        data: BP
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/Pedido/:pedido', (req, res) => {
  try {
    (async () => {
      let pedido_codigo = req.params.pedido
      let objeto = await sl.get(`Orders(${pedido_codigo})`)
      res.json({
        success: true,
        data: objeto
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.patch('/Pedido/:pedido', (req, res) => {
  try {
    (async () => {
      let parsedBody = req.body
      let cliente_pedido = req.params.pedido
      //        let parsedBody = JSON.parse(req.body);
      let objeto = await sl.patch(`Orders('${cliente_pedido}')`, {
        //"Series": 76,
        "CardName": parsedBody.Name,
        //"CardType": "C",
        "FederalTaxID": parsedBody.RFC__c,
        "ChannelBP": "CNM00598",
        "U_NimboID": parsedBody.Id,
        //"ListNum": 3,
        "U_CEU_CPORTAL": parsedBody.Email__c,
        //"Currency": "MXP",
        "PriceListNum": 3,//Buscar por tipo de registro,
        "U_Modelo":  parsedBody.Razon_social__c,
        "B1SYS_MainUsage": parsedBody.Uso_de_CFDI__c,
        "U_MARCA": parsedBody.Regimenl_fiscal__c
        // "Limite_de_credito__c": parsedBody.Limite_de_credito__c
      })
      //console.log(orders)
      res.json({
        success: true,
        data: objeto
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})

// Se anexan EndPoints para Ecommerce





/*PRUEBAS*/
app.post('/GuardarBP', (req, res) => {

  try {
    (async () => {
      let parsedBody = req.body
      //        let parsedBody = JSON.parse(req.body);
      let BP = await sl.post(`BusinessPartners`, {
        "Series": getSerieBP(parsedBody.RecordTypeId),
        "CardName": parsedBody.Name,
        "CardType": "C",
        "FederalTaxID": parsedBody.RFC__c,
        "ChannelBP": "CNM00598",
        "U_SalesForceID": parsedBody.Id,
        //"ListNum": 3,
        "U_CEU_CPORTAL": parsedBody.Email__c,
        //"Currency": "MXP",
        "PriceListNum": 3//Buscar por tipo de registro
        // "Limite_de_credito__c": parsedBody.Limite_de_credito__c
      })
      //console.log(orders)
      res.json({
        success: true,
        data: BP
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/ConsultarBP/:codigo', (req, res) => {
  try {
    (async () => {
      let cliente_codigo = req.params.codigo
      let cliente = await sl.get(`BusinessPartners?$filter=Cardcode eq '${cliente_codigo}'&$top=1`)
      res.json({
        success: true,
        data: cliente
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})
app.get('/ConsultarBP/:rfc', (req, res) => {
  try {
    (async () => {
      let cliente_rfc = req.params.rfc
      let cliente = await sl.get(`BusinessPartners?$select=CardCode,CardName,FederalTaxID&$filter=FederalTaxID eq '${cliente_rfc}'&$top=1`)
      res.json({
        success: true,
        data: cliente
      })
    })();
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request.'
    });
  }
})

function getToken() {
  var req = {
    uri: "https://test.salesforce.com/services/oauth2/token?username=Confietc@ultra.dev&password=ADMIN2024-2&grant_type=password&client_id=3MVG9teL341d2zQDdKYjF97BxkRbTfQaP4ZZiFeoF0ANug5.KxDOiaVR0DReT5xYrSnCiL0IBm89XhSXTxQDx&client_secret=3585F40E21C7C20B9B385245E6932E1F7F96754E3DC503FA85BDA665C4B4ED47",
    method: "POST"
  }
  return new Promise(function (resolve, reject) {
    request(req, function (error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
function requestSalesForce(req) {
  return new Promise(function (resolve, reject) {
    request(req, function (error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
app.get('/testGuardarBP', (req, res) => {
  let pagos
  var req = {
    uri: "https://energy-flow-2342--ultradev.sandbox.my.salesforce.com/services/data/v58.0/sobjects/Account/id/001D600001nAjicIAC",
    method: "GET",
    headers: {
      "Authorization": "Bearer 00DD6000000VZfN!AQUAQAT0Z4UJ3xUGB6KuplfziELp3TlRktEe8RXjBbA6Lziy4KkPqTOF9i8pP0merqN_EQ_nbg6NaotsHUCkrhj_6rYNli9I",
      "Content-Type": "application/json"
    }
  }
  request(req, function (error, response, body) {
    //console.log('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body);
    if (response.statusCode == 200) {
      (async () => {
        let parsedBody = JSON.parse(body);
        console.log(parsedBody.Id);
        pagos = await sl.post(`BusinessPartners`, {
          "Series": 76,
          "CardName": parsedBody.Name,
          "CardType": "C",
          "FederalTaxID": "GAAJ0911886F3",
          //"ChannelBP" : "CNM00598",
          "U_SalesForceID": parsedBody.Id,
          "ListNum": 3,
          "U_CEY_CPORTAL": parsedBody.Email__c,
          "Currency": "MXP",
          "PriceListNum": 0,//Buscar por tipo de registro
          "Limite_de_credito__c": parsedBody.Limite_de_credito__c,


        })
        //console.log(orders)
        res.json({
          ok: true,
          pagos
        })
      })();
    }
  });
})

var options = {
  key: fs.readFileSync('./ssl/powerhost.key', 'utf8'),
  cert: fs.readFileSync('./ssl/powerhost.crt', 'utf8'),
  ca: fs.readFileSync('./ssl/SectigoRSADVBundle.pem', 'utf8')
};

var server = https.createServer(options, app).listen(8069, function () {
  console.log("Express server listening on port " + 8069);
});

/*app.listen(8081, () => {
  console.log('Escuchando puerto: ', 81)
})*/