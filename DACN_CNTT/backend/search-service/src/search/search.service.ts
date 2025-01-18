
import { Injectable } from '@nestjs/common';



@Injectable()
export class SearchService {
    constructor() { }

    // Tạo chỉ mục (index)


    //   async search(index: string, query: any) {
    //     const { body } = await this.elasticsearchService.search({
    //       index,
    //       body: query,
    //     });
    //     return body.hits.hits.map((hit) => hit._source);
    //   }

    //   async indexDocument(index: string, id: string, document: any) {
    //     return this.elasticsearchService.index({
    //       index,
    //       id,
    //       body: document,
    //     });
    //   }
}
