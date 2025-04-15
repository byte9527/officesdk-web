export type SchemaValueCallback = {
  type: 'callback';
  source: string;
  ref: string;
};

export type SchemaValueRef = {
  type: 'ref';
  source: string;
  ref: string;
};

export type SchemaValueData = {
  type: 'data';
  value: any;
};

export type SchemaValue = SchemaValueCallback | SchemaValueRef | SchemaValueData;

export type SchemaStructuredArray = {
  type: 'array';
  value: Array<SchemaEntity>;
};

export type SchemaStructuredMap = {
  type: 'map';
  value: {
    [key: string]: SchemaEntity;
  };
};

export type SchemaStructured = SchemaStructuredArray | SchemaStructuredMap;

export type SchemaEntity = SchemaValue | SchemaStructured;
