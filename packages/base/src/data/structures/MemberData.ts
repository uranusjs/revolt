import type { FileStruct, MemberCompositeKeyStruct, MemberStruct } from '@uranusjs/models-revolt';
import type { RestClient } from '@uranusjs/rest-revolt';
import { RestBase } from '../../restAction/RestBase';

export class MemberData {
    _id: MemberCompositeKeyStruct | string | null = null;
    joinedAt: number | null = null;
    nickname: string | null = null;
    avatar: FileStruct | null = null;
    roles: Array<string> | null = null;
    timeout: number | null = null;
    constructor(data?: MemberStruct) {
        if (data !== undefined) {
            this.updateData(data);
        }
    }

    updateData(data?: MemberStruct) {
        if (data?._id !== undefined) {
            this._id = data._id;
        }
        if (data?.avatar !== undefined) {
            this.avatar = data.avatar;
        }
        if (data?.joined_at !== undefined) {
            this.joinedAt = data.joined_at;
        }
        if (data?.avatar !== undefined) {
            this.avatar = data.avatar;
        }
        if (data?.roles !== undefined) {
            this.roles = data.roles;
        }
        if (data?.timeout !== undefined) {
            this.timeout = data.timeout;
        }
    }
}

export class MemberRest extends MemberData {
    private readonly _memberData: MemberData;
    private readonly _restBase: RestBase;
    constructor(restClient: RestClient, memberData: MemberData) {
        super();
        this._restBase = new RestBase(restClient);
        this._memberData = memberData;
    }
}
