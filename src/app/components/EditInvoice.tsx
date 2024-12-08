"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {CalendarIcon} from "lucide-react";
import {SubmitButton} from "./SubmitButtons";
import {useActionState, useState} from "react";
import {editInvoice} from "../actions";
import {formatCurrency} from "../utils/formatCurrency";
import {Prisma} from "@prisma/client";
import {useForm} from "react-hook-form";
import {invoiceSchema, TInvoiceSchema} from "@/app/utils/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";

interface iAppProps {
    data: Prisma.InvoiceGetPayload<{}>;
}

export function EditInvoice({data}: iAppProps) {
    const [lastResult, action] = useActionState(editInvoice, undefined);
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<TInvoiceSchema>({
        resolver: zodResolver(invoiceSchema)
    });

    const [selectedDate, setSelectedDate] = useState(data.date);
    const [rate, setRate] = useState(data.invoiceItemRate.toString());
    const [quantity, setQuantity] = useState(data.invoiceItemQuantity.toString());
    const [currency, setCurrency] = useState(data.currency);

    const calcualteTotal = (Number(quantity) || 0) * (Number(rate) || 0);

    const onSubmit = async (formData: TInvoiceSchema) => {

    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit((data)=> {})} className="space-y-6" noValidate>
                    <input
                        {...register('date')}
                        type="hidden"
                        value={selectedDate.toISOString()}
                    />
                    <input type="hidden" name="id" value={data.id}/>

                    <input
                        type="hidden"
                        name="totalName"
                        value={calcualteTotal}
                    />

                    <div className="flex flex-col gap-1 w-fit mb-6">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary">Draft</Badge>
                            <Input
                                {...register('invoiceName')}
                            />
                        </div>
                        <p className="text-sm text-red-500">{errors.invoiceName?.message}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <Label>Invoice No.</Label>
                            <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
                  #
                </span>
                                <Input
                                    {...register('invoiceNumber')}
                                    className="rounded-l-none"
                                    placeholder="5"
                                />
                            </div>
                            <p className="text-red-500 text-sm">
                                {errors.invoiceNumber?.message}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label>From</Label>
                            <div className="space-y-2">
                                <Input
                                    {...register('fromName')}
                                    placeholder="Your Name"
                                    defaultValue={data.fromName}
                                />
                                <p className="text-red-500 text-sm">{errors.fromName?.message}</p>
                                <Input
                                    placeholder="Your Email"
                                    {...register('fromEmail')}
                                    defaultValue={data.fromEmail}
                                />
                                <p className="text-red-500 text-sm">{errors.fromEmail?.message}</p>
                                <Input
                                    placeholder="Your Address"
                                    {...register('fromAddress')}
                                    defaultValue={data.fromAddress}
                                />

                                    <p className="text-red-500 text-sm">{errors.fromAddress?.message}</p>

                            </div>
                        </div>

                        <div>
                            <Label>To</Label>
                            <div className="space-y-2">
                                <Input
                                    {...register('clientName')}
                                    defaultValue={data.clientName}
                                    placeholder="Client Name"
                                />
                                    <p className="text-red-500 text-sm">{errors.clientName?.message}</p>

                                <Input
                                    {...register('clientEmail')}
                                    defaultValue={data.clientEmail}
                                    placeholder="Client Email"
                                />
                                <p className="text-red-500 text-sm">
                                    <p className="text-red-500 text-sm">{errors.clientEmail?.message}</p>
                                </p>

                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div>
                                <Label>Date</Label>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-[280px] text-left justify-start"
                                    >
                                        <CalendarIcon/>

                                        {selectedDate ? (
                                            new Intl.DateTimeFormat("en-US", {
                                                dateStyle: "long",
                                            }).format(selectedDate)
                                        ) : (
                                            <span>Pick a Date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        selected={selectedDate}
                                        onSelect={(date) => setSelectedDate(date || new Date())}
                                        mode="single"
                                        fromDate={new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className="text-red-500 text-sm">{errors.date?.message}</p>
                        </div>

                        <div>
                            <Label>Invoice Due</Label>
                            <Select
                                {...register('dueDate')}
                                defaultValue={data.dueDate.toString()}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select due date"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Due on Reciept</SelectItem>
                                    <SelectItem value="15">Net 15</SelectItem>
                                    <SelectItem value="30">Net 30</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-red-500 text-sm">{errors.dueDate?.message}</p>
                        </div>
                    </div>

                    <div>
                        <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
                            <p className="col-span-6">Description</p>
                            <p className="col-span-2">Quantity</p>
                            <p className="col-span-2">Rate</p>
                            <p className="col-span-2">Amount</p>
                        </div>

                        <div className="grid grid-cols-12 gap-4 mb-4">

                            <div className="col-span-2">
                                <Input
                                    value={formatCurrency({
                                        amount: calcualteTotal,
                                        currency: currency as any,
                                    })}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-1/3">
                            <div className="flex justify-between py-2">
                                <span>Subtotal</span>
                                <span>
                  {formatCurrency({
                      amount: calcualteTotal,
                      currency: currency as any,
                  })}
                </span>
                            </div>
                            <div className="flex justify-between py-2 border-t">
                                <span>Total ({currency})</span>
                                <span className="font-medium underline underline-offset-2">
                  {formatCurrency({
                      amount: calcualteTotal,
                      currency: currency as any,
                  })}
                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label>Note</Label>
                        <Textarea
                            {...register('note')}
                            defaultValue={data.note ?? undefined}
                            placeholder="Add your Note/s right here..."
                        />
                        <p className="text-red-500 text-sm">{errors.note?.message}</p>
                    </div>

                    <div className="flex items-center justify-end mt-6">
                        <div>
                            <SubmitButton text="Update Invoice"/>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}