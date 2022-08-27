import type { RoleStruct } from '@uranusjs/models-revolt';

export class RoleData {
  name: string | null = null;
  permissions: number | null = null;
  colour: string | null = null;
  hoist: boolean | null = null;
  rank: number | null = null;
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