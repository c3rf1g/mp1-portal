import {getUserAccount} from "@decentraland/EthereumController";
import * as ui from "@dcl/ui-scene-utils";
import {getProvider} from "@decentraland/web3-provider";
import {ContractFactory, RequestManager} from "eth-connect";
import {shard_abi} from "./shardAbi";
export const createPortal = (_scene: IEntity | Attachable | null, x: number | undefined, y: number | undefined,  z: number | undefined) => {
    const finalPortals = new Entity('finalPortals')
    engine.addEntity(finalPortals)
    finalPortals.setParent(_scene)
    const transform305 = new Transform({
        position: new Vector3(x, y, z),
        rotation: new Quaternion(-1.528347604147441e-15, 0.8819212913513184, -1.0513319637084351e-7, 0.47139671444892883),
        scale: new Vector3(1, 1, 1)
    })
    finalPortals.addComponentOrReplace(transform305)
    const gltfShape18 = new GLTFShape("3e29b5a2-f900-4f8c-8728-8ea4263b88df/BigPortal2.gltf")
    gltfShape18.withCollisions = true
    gltfShape18.isPointerBlocker = true
    gltfShape18.visible = true
    finalPortals.addComponentOrReplace(gltfShape18)

    finalPortals.addComponentOrReplace(
        new OnPointerDown(async () => {

                var countShards = 0
                const address = await getUserAccount()
                log(address)
                let prompt = new ui.CustomPrompt(ui.PromptStyles.LIGHT, 600, 400)
                prompt.addText('Amount of shards to mint', 0, 150, Color4.Red(), 30)
                prompt.addTextBox(0, 0, "0", (e) => {
                    countShards = parseInt(e)
                    log(countShards)
                })

                prompt.addButton(
                    "Mint",
                    0,
                    -150,
                    () => {
                        executeTask(async () => {
                            try {
                                // Setup steps explained in the section above
                                const provider = await getProvider()
                                const requestManager = new RequestManager(provider)
                                const factory = new ContractFactory(requestManager, shard_abi)

                                const contract = (await factory.at(
                                    "0xaA5e47C2e2B1c8b92CDA21Da1EB7777fFaADf0C5"
                                )) as any
                                const address = await getUserAccount()

                                const shard_price = 0.55
                                const shard_white_price = 0.5
                                const shard_gold_price = 0.4
                                const isGold = await contract.isGoldList({
                                    from: address
                                })

                                const isWhite = await contract.isWhiteList({
                                    from: address
                                })

                                let price = shard_price;
                                if (isGold)
                                    price = shard_gold_price
                                if (isWhite)
                                    price = shard_white_price
                                log(isGold, isWhite)

                                const res = await contract.mint(
                                    countShards
                                    ,
                                    {
                                        from: address,
                                        value: price * countShards * 10 ** 18
                                    }
                                )
                                // Log response
                                log(res)
                            } catch (error) {
                                log(error.toString())
                            }
                        })
                        prompt.hide()
                    })
            }
        )
    )
}