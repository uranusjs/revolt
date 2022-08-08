import type { RoleStruct } from '@uranusjs/models-revolt';

export class RoleData {
  name!: string;
  permissions?: number;
  colour?: string;
  hoist?: boolean;
  rank?: number;
  constructor(data?: RoleStruct) {
    if (data !== undefined) {
      this.updateData(data)
    }
  }
  updateData(data: RoleStruct) {
    if (data?.name !== undefined) {
      this.name = data.name
    }
    if (data?.permissions !== undefined) {
      this.permissions = data.permissions
    }
    if (data?.colour !== undefined) {
      this.colour = data.colour
    }
    if (data?.hoist !== undefined) {
      this.hoist = data.hoist
    }
    if (data?.rank !== undefined) {
      this.rank = data.rank
    }
  }
}